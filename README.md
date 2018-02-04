# gh-release-upload
[![npm](https://img.shields.io/npm/v/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload)
[![npm license](https://img.shields.io/npm/l/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload)
[![npm downloads](https://img.shields.io/npm/dm/gh-release-upload.svg?style=flat-square)](https://npmjs.com/package/gh-release-upload)

Upload files to GitHub releases

## Install via [npm](https://npmjs.com)

```sh
$ npm install --global jhermsmeier/gh-release-upload
```

## Usage

```
gh-release-upload [options] <assets>

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --repo, -r  Repository (owner/reponame)                    [string] [required]
  --draft     Release is a draft                                       [boolean]
  --name, -n  Release name                                              [string]
  --tag, -t   Release tag                                               [string]
  --list, -l  Only list currently available tags                       [boolean]

Examples:
  gh-release-upload --list --repo jhermsmeier/example
  gh-release-upload -r jhermsmeier/example --draft --name v1.4.0 dist/*
```
