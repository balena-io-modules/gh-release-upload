var Emitter = require( 'events' )
var fs = require( 'fs' )
var path = require( 'path' )
var async = require( 'async' )
var mime = require( 'mime-types' )
var debug = require( 'debug' )( 'gh-upload' )
var octokit = require( '@octokit/rest' )()

function authenticate( credentials ) {
  return octokit.authenticate( credentials )
}

function createRelease( options, callback ) {
  octokit.repos.createRelease({
    owner: options.owner,
    repo: options.repo,
    tag_name: options.tag,
    target_commitish: options.commit,
    draft: options.draft,
    body: options.body,
    prerelease: options.prerelease,
  }, callback )
}

function deleteRelease( options, callback ) {
  octokit.repos.getReleaseByTag({
    owner: options.owner,
    repo: options.repo,
    tag_name: options.tag,
  }, ( error, result ) => {

    if( error ) {
      return callback( error )
    }

    octokit.repos.deleteRelease({
      owner: options.owner,
      repo: options.repo,
      id: result.id,
    }, callback )

  })
}

function getReleases( options, callback ) {
  octokit.repos.getReleases({
    owner: options.owner,
    repo: options.repo,
  }, (error, result) => {

    if( error ) {
      return callback( error )
    }

    if( options.all ) {
      return callback( null, result.data )
    }

    var releases = result.data.filter(( release ) => {

      var keep = true

      if( options.name != null )
        keep = keep && release.name == options.name
      if( options.tag != null )
        keep = keep && release.tag == options.tag

      if( options.draft && options.prerelease ) {
        keep = keep && (release.draft == options.draft ||
          release.prerelease == options.prerelease)
      } else if( options.draft || options.prerelease ) {
        if( options.draft )
          keep = keep && release.draft == options.draft && !release.prerelease
        if( options.prerelease )
          keep = keep && release.prerelease == options.prerelease
      } else {
        keep = keep && !(release.prerelease || release.draft)
      }

      return keep

    })

    callback( null, releases )

  })
}

function uploadAsset( filename, options, callback ) {

  var basename = path.basename( filename )
  var contentType = mime.lookup( basename ) ||
    'application/octet-stream'

  fs.stat( filename, ( error, stats ) => {

    if( error ) {
      return callback( error )
    }

    octokit.repos.uploadAsset({
      url: options.url,
      file: fs.createReadStream( filename ),
      contentType: contentType,
      contentLength: stats.size,
      name: basename,
      label: options.label,
    }, (error, result) => {
      callback( error, result )
    })

  })

}

function uploadAssets( release, assets, callback ) {

  var emitter = new Emitter()

  process.nextTick(() => {
    async.mapSeries( assets, ( filename, next ) => {
      emitter.emit( 'upload', filename )
      uploadAsset( filename, { url: release.upload_url }, ( error, result ) => {
        if( !error ) {
          emitter.emit( 'uploaded', filename, result )
        }
        next( error, result )
      })
    }, (error, results) => {
      callback( error, results )
    })
  })

  return emitter

}

module.exports = {
  createRelease: createRelease,
  getReleases: getReleases,
  uploadAsset: uploadAsset,
  uploadAssets: uploadAssets,
  authenticate: authenticate,
}
