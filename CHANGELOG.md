# Changelog
All notable changes to Hylo Utils (shared utils for all Hylo products) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.9]
## Added
- `LocationHelpers.parseCoordinate` and `convertCoordinateToLocation` relocated from `hylo-evo`

## [1.6.8]
## Added
- `LocationHelpers.convertMapboxToLocation` function to concvert the response from mapbpx geocoding into the format we use for locations

## [1.6.5]
## Changed
- Changed markdown library is configured to work in transpiled distribution

## [1.6.4]
## Changed
- Disable GFM autolinking in markdown: all autolinking should be handled by linkify at point of display

## [1.6.3]
## Changed
- BREAKING CHANGES: text, validators have been changed to TextHelpers, PathHelpers, Validators
- Input sanitization removed on TextHelpers#markdown

## [1.3.0]
### Changed
- Add shared DraftJS `contentState` related conversion routines
- Remove unused code
- Change build to dist directory

## [1.2.5]

### Fixed
- Sanitize text when using marked for markdown

### Changed
- Update marked library to latest release

## [1.2.4]
### Added
- CHANGELOG

### Fixed
- Use updated cheerio dependency to make compatible with latest enzyme's use of the htmlparser2 peer depdency which is polluting NPM space

## [1.0.4]

### Changed
- Whitelisted more attributes for text#sanitize to accomodate saving of mentions and topics from HyloEditor

## [1.0.5]
### Changed
- Updated linkify > cleanupLink function to expand mention links with
URL as is currently done with topics (hashtags)

## [1.0.6]
### Changed
- Added threadNames which accepts an array of names and displays them in a screen size friendly way


## [1.0.9]
### Fixed
- Linkify's handling of hashtags 

## [1.1.0]

### Added
- Simple validation scheme for model properties

## [1.1.1]
### Added
- `div` to tag whitelist for sanitize (required in comments).


### Added
- dToP: Cheerio dependency, converts div tags from mobile client to p.

## [1.2.2]
### Changed
- text > present to accept noLinks option to not convert links and hashtags into anchors

## [1.2.3]
### Added
- Topic name validator
