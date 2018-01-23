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

function getReleases( options, callback ) {
  octokit.repos.getReleases({
    owner: 'resin-io',
    repo: 'etcher',
  }, (error, result) => {

    if( error ) {
      return callback( error )
    }

    var releases = result.data.filter(( release ) => {

      var keep = true

      if( options.draft != null )
        keep = keep && release.draft == options.draft
      if( options.name != null )
        keep = keep && release.name == options.name
      if( options.tag != null )
        keep = keep && release.tag == options.tag

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
  getReleases: getReleases,
  uploadAsset: uploadAsset,
  uploadAssets: uploadAssets,
  authenticate: authenticate,
}
