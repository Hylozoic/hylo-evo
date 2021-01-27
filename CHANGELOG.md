# Changelog
All notable changes to Hylo Evo (the Hylo front-end) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Not being able to turn on or off notifications for communities

### Added
- Removed Skills slide from account signup wizard.

## [2.2.4] - 2021-01-12
### Fixed
- Don't allow posting of an empty comment.
- Not being able to turn on or off notifications for communities

### Added
- Add sections for a person's Hylo communities and other custom affiliations on their member profile
- Update settings page Affiliations to allow listing custom org affiliations

## [2.2.3] - 2020-12-16
### Fixed
- Adjusted signup wizard Skills slide so styles work on mobile web.

### Added
- Add events section to member profile, showing upcoming events the person is attending

## [2.2.2] - 2020-12-09
### Added
- Added Skills to Learn to user profiles

### Fixed
- Couldnt click Edit Profile button
- Bug with routing when clicking on a project from a user profile and then trying to close it

## [2.2.1] - 2020-12-05
### Added
- Projects section to member profile

### Fixed
- Adjusted signup wizard css to show Onwards button when creating an account on Hylo (web) while using a mobile device.

## [2.2.0] - 2020-11-22
### Added
- Add SavedSearches menu on MapExplorer and SavedSearchesTab in UserSettings. Users can view a list of their saved searches and delete a saved search from either of these locations. Users can create a saved search from the MapExplorer view.

### Changed
- Updates required for 1.4.0 hylo-node update and heroku stack-18
- Update Facebook and Google login and sign-up buttons to brand compliance #700
- Notification opt-in prompt covers saved searches too (in addition to communities)
- Fix editing of values on user sign-up and community create review screens (fixes #685)
- Remove editing of user name and email from Community Creation flow (fixes #579, #582)

## [2.1.9] - 2020-10-23
## Fixed
- Member Profile Action icons remaining in hover state after hover is gone
- Member Profile copy links copying object, not plain text
- Member Profile bio without tagline formatting

## [2.1.8] - 2020-10-23
### Changed
- New Member Profile layout including contact phone and email

## Fixed
- User profile changes being overwriten while editing

## [2.1.7] - 2020-10-14
## Fixed
- Fixes issue with returning signing-up users getting stuck on blank screen
- Pinned posts with Pin icon at top of feeds show once again

## [2.1.6] - 2020-10-10
### Added
- Adds contactEmail and contactPhone to Person

### Changed
- Improves Member Profile formatting
- Re-organizes Profile and Account settings and related menus items

### Fixed
- Returns to sign-up wizard on page reload if incomplete

## [2.1.6] - 2020-10-10
### Added
- Adds contactEmail and contactPhone to Person

### Changed
- Improves Member Profile formatting
- Re-organizes Profile and Account settings and related menus items

### Fixed
- Returns to sign-up wizard on page reload if incomplete

## [2.1.5] - 2020-09-28
### Changed
- Make it more obvious how to change avatar in settings, can now click on entire image to change it
- Improve text on toggle to make a post public to make it more clear what is happening

## [2.1.4] - 2020-09-12
### Added
When zoomed in enough show a label for features on the map

### Fixed
Make sure map drawer updates as viewport changes

## [2.1.3] - 2020-08-30
### Added
- Show a spinner while posts are loading on the map

### Changed
- Default to showing map drawer
- Don't show not working Members link in All Communities or Public contexts
- Make many less queries to the server while moving around the map

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

### Fixed
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
