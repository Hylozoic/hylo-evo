# Changelog
All notable changes to Hylo Evo (the Hylo front-end) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Show a spinner while posts are loading on the map

### Changed
- Default to showing map drawer
- Don't show not working Members link in All Communities or Public contexts

### Fixed
- Clicking on a post in the All Communities map view works now
- Opening map drawer shrinks map visible portion so it doesnt show posts that are not visible on the map
- When clicking to zoom in on a cluster on the map don't zoom to a location where you cant see the posts in the cluster
- Safari: Fixed gradient on about text for a community in the sidebar
- Extra whitespace in posts and comments everywhere
- Remove duplicate topics showing at network level in nav drawer

## [2.1.2] - 2020-08-19
### Added
- Beta verison of CSV post importing

### Bugs Fixed
- Bring upvoting back

## [2.1.1] - 2020-08-17
### Added
- Allow for viewing public map when not logged in to Hylo at https://hylo.com/public/map/. Can also filter the map by one or more network with the ?network=XXX query parameter

## [2.1.0] - 2020-08-14
### Added
- Show topics in Network and All Communities views
- Community Topic Management: admins can add default/suggested topics for their community which new members will be auto subscribed to and all users will see first when creating a new post. THey can also add pinned topics which appear at the top of the topic nav list and can hide topics from the all topics list for the community.
- Public community join requests. Users looking at a public community on the map can request to join it. This notifies the community admin and they can accept or reject the request. When a request is accepted the user is notified.
- Comment attachments: Images and files can added to comments.
- Can now jump to a location on the map through a new location search box.

### Changed
- Resources no longer require a location.
- Community members can no longer add a new topic to the community except by creating a post with that new topic.
