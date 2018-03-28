# gh-release-upload
<!-- [![npm](https://img.shields.io/npm/v/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload) -->
<!-- [![npm license](https://img.shields.io/npm/l/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload) -->
<!-- [![npm downloads](https://img.shields.io/npm/dm/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload) -->

Upload files to GitHub releases

## Install via [npm](https://npmjs.com)

```sh
$ npm install --global jhermsmeier/gh-release-upload
```

## Usage

```
gh-release-upload <command>

Commands:
  gh-release-upload list    List releases
  gh-release-upload create  Create a release
  gh-release-upload delete  Delete a release
  gh-release-upload info    Get release data
  gh-release-upload upload  Upload assets to a release

General options:
  --repo, -r  Repository (owner/reponame)  [string] [required]

Options:
  --help, -h     Show help  [boolean]
  --version, -v  Show version number  [boolean]

Commands options:

  list [options]:
    --draft       Include drafts  [boolean]
    --prerelease  Include prereleases  [boolean]
    --all         Show all release types  [boolean]

  create [options]:
    --tag, -t     Release tag  [string] [required]
    --name, -n    Release name  [string]
    --commit, -c  Release target commitish  [string] [default: "master"]
    --body, -m    Release message body  [string]
    --update      Update release data  [boolean]
    --draft       Release is a draft  [boolean]
    --prerelease  Release is a prerelease  [boolean]

  delete [options]:
    --tag, -t     Release tag  [string] [required]

  info [options]:
    --tag, -t     Release tag  [string] [required]

  upload [options] <assets>:
    --tag, -t     Release tag  [string] [required]
    --name, -n    Release name  [string]
    --draft       Release is a draft  [boolean]
    --prerelease  Release is a prerelease  [boolean]
```
