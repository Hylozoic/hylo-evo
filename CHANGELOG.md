# Changelog
All notable changes to Hylo Evo (the Hylo front-end) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.8] - 2022-01-23

### Added
- WebPack bundle analyzer. To analyze bundle `yarn build` and once complete `yarn analyze`

## Changed
- Lazy load Messages and Notifications top menu items to improve initial load time and rendering
- Replaced deprecated node-sass dependency with sass (Dart SASS)
- Move to Node 16
- Change faker dependency used in tests, and remove deprecated feature that was causing it to be included in production bundle
- Clean-up package.json
- Minor WebPack optimization config changes

## [3.2.7] - 2022-01-22

## Fixed
- Remove extra whitespace on right side of Map on full browser windows

## [3.2.6] - 2022-01-21

## Changed
- Improve initial app load time: remove extra fields from current user query and parallel load current user alongside current group

## [3.2.5] - 2022-01-18

## Changed
- Minor tidy and refactor of mobile device checking code
## Fixed
- MapExplorer drawer hide mobile check corrected so that drawer shows again in web

## [3.2.4] - 2022-01-17

## Changed
- Hide MapExplorer drawer by default on mobile browsers and in Hylo App embed
- Allow MapExplorer Saved Searches navigation to happen when in Hylo App embed
- Fix hover state for MapExplorer on touch-based devices

## [3.2.3] - 2022-01-14

## Fixed 
- Map styling fixes related to nav-less layout used in the embedded Hylo App WebView
- Changes login text entry field to "email" from "text" to keep auto-capitalization off in some browsers

## [3.2.2] - 2022-01-13

### Changed
- Added needed mobile app layout modifications to MapExplorer
- Added route interception to MapExplorer when in mobile app context
- Added HTTPS to MapBox API URL

## [3.2.1] - 2021-12-29

### Changed
- Cleanup display of post start and end times to be easier to read - don't uppercase text, better syntax.
- If a post was "completed" before it ended show the end date as the date it was completed
- Improve copy for comment box placeholder

### Fixed
- Fix issue where posts without a start/end time would always show as ENDED
- Make sure you can see the dropdown to block a member

## [3.2.0] - 2021-12-17

### Added
- New signup/registration flow that includes email verification, password confirmation and in general better security practices.
- You can now deactivate or delete your account from the Settings -> Account page.
- You can now use Markdown when editing the welcome message on the explore page for your group. This means links will work as well.

### Changed
- Attachments on posts now display in a list instead of a row so you can see any number of attachments. Previously you could see only the first 6 or so.

### Fixed
- Editing welcome message on explore page updates the widget instantly.

## [3.1.11] - 2021-12-3
### Fixed
- Display of map icons on latest safari
- Inviting people to public events

## [3.1.10] - 2021-12-2
### Added
- Display timezone for datetimes in requests, offers and resources
- You can now specify locations for people, groups and posts as coordinates
- Scrolling will now show more suggested event invites

### Fixed
- Saving your individual or group settings could erase your location from the map
- Hylo URLs in posts that dont have www at the front will correctly load in the same tab instead of opening a new one

## [3.1.9] - 2021-11-2
### Fixed
- Only most recent 2 child comments appearing in a comment thread

## [3.1.8] - 2021-11-1
### Added
- Add Layout Flags context to capture the `layoutFlags` query param and make it available in React context as `<layoutFlag>Layout`
- Switch on/off site header and footer for `mobileSettingsLayout` 
- Update and normalize Group Settings area UI, optimizing for small/mobile screens

## [3.1.7] - 2021-10-26
### Added
- Contributor guide and code of conduct to the repo

### Changed
- Clicking on link to a Hylo post from a post loads in same tab not new one
- Update user Affiliations settings tab to say Groups & Affiliations

### Fixed
- Resetting of unread counts when viewing a group and a topic
- Scrolling list of people who have responded to an event

## [3.1.6] - 2021-08-31
### Added
- Ability to pass in a group name and slug as URL parameters to group creation modal

### Fixed
- Signup with social logins works again
- You can now export data from large groups. The exported CSV file will be sent in an email.
- Hylo links in posts now load that link in the same tab not in a new tab
- Bug loading posts on member profile page
- About button on Explore page stays on Explore page instead of going to Stream

## [3.1.5] - 2021-08-04
### Changed
- Events view now show Upcoming events in start time order and has an option to show Past events in descending start time order.

### Fixed
- (Un)subscribing to a topic from a topic feed banner

## [3.1.4] - 2021-07-08
### Added
- Show timezone for an event's start and end time
- Support local development with SSL

### Changed
- Switch back to the stream being the home page for groups. Show Explore page on the first time viewing a group.

### Fixed
- Editing a post deleting its images

## [3.1.3] - 2021-05-06
## Changed
- Longer group names on mobile

### Fixed
- Fixed editing posts on mobile web
- Fix bugs related to navigation menu on mobile

## [3.1.2] - 2021-04-30
## Changed
- You can now start typing a topic with a # and it will correctly create the topic or autocomplete existing topics
- Make join questions required before you can join a group

### Fixed
- Bug that prevented clicking on a comment to edit it at that locaion
- Broken links to posts in emails
- Bug when landing on a group page as a brand new user
- Placeholder text scrolling on top of post header

## [3.1.1] - 2021-04-21
## Added
- GDPR cookie notice when signing up for Hylo.

## Changed
- Allow for group names up to 60 characters.
- Show moderators on group about panel.
- Improved default group welcome message on landing page.

### Fixed
- Immediately navigate away from a post after deleting it.
- Immediately update the landing page when editing a post, deleting a post, or removing a post from the group.
- Correctly enable/disable ask join question form in group settings.
- Sometimes crashing bug when creating a new message.
- Style tweaks on group landing page.
- Show correct welcome tour steps on mobile and desktop.
- Show group welcome modal before showing tour.
- Dont show welcome modal twice if closed quickly.

## [3.1.0] - 2021-04-16
### Added
- __New group home page__: Groups now have a landing page that shows customizable widgets displaying recent announcements, recent posts, open requests and offers, upcoming events, recently active projects, recenty active members, sub-groups, and a customizable welcome message. Moderators can hide widgets for their group if desired.
- __Customizable post stream__: The post stream is now a separate view and has a compact list view on top of the current card view. Also the sort and post type filter settings will be remembered across groups and refreshes.
- __Prerequisite group__: If a moderator adds these to a group that means the prerequisite groups have to be joined by a user before they can join the original group.
- __Suggested skills__: A moderator can now add suggested skills & interests in a group's settings. These will be displayed on the group join form - when a user is requesting to join a group they will be shown the suggested skills and can select which ones are relevant to them. If a user is invited to a group then this join form with suggested skills will popup when they first land on the group.
- __Group to Group Join Questions__: Moderators can add join questions in the group settings that get asked when another group is requesting to join it as a child group. The answers appear in the Related Groups page for incoming group join requests.
- Add Group Network Map Visualization to Groups View
- Group moderators can now export the member directory for a Group to a CSV from a new Export Data group settings tab.

### Changed
- Added a new menu button in the top nav to open the navigation drawer. Now clicking on the current context/group icon or name in the top nav will go back to the Home page for the current context.
- Better style for Group Settings link in the group sidebar.
- When changing contexts or views we scroll back to the top of the page.
- Added group banner image to navigation drawer.
- Increased contrast between read and unread notifications.

### Fixed
- Issue that sometimes caused group join button to not be visible on group details on small screens.
- RSVPing to events on mobile web.
- Ability to add Facebook, Twitter and LinkedIn URLs to profile

## [3.0.2] - 2021-04-08
### Fixed
- Fixed issues saving and viewing Saved Searches on the map
- Fixed viewing join requests settings page
- You can edit comments once again
- Closed groups don't show request to join button

## [3.0.1] - 2021-04-07
### Fixed
- Issues on the Groups page where we would incorrectly show a person having requested membership in a group or not show that they had requested membership
- Make sure new posts appear in the stream immediately
- Join questions now correctly appearing when trying to join a group that has them specified

## [3.0.0] - 2021-04-02
### Added
- __Holonic Architecture!__ You can now add infinitely nested groups within groups within groups. And groups can have multiple "parent groups" too. This is the beginning of truly enabling us to map and connect complex organizations and ecosystems and how groups of all kinds work together.
- Added a new Groups page in the group nav menu that shows all the "parent" groups and "child" groups of the current group.
- Looking at a group's stream will show you all the posts to that group + all the posts to any descendant groups that you are also a member of
- When looking at the map for a group you will see the group itself on the map plus all descendant groups.
- __Group relationship invites/requests:__ Groups can request to join other groups or invite a group to join them, and these invites/requests can be canceled, accepted or rejected by moderators of the other group. This all happens from the new group settings page "Related Groups".
- __Group Join Questions:__ groups can now have questions that must be answered when a person is requesting to join the group. These are set up in the group settings page, and the form with the questions to answer shows up anywhere we show a Request to Join button to a user (when they are looking at a group they are not a member of that they are allowed to join because the accessibility setting is Restricted.)
- __Manage Invites & Requests__: New user settings page for Invites & Requests where you can see any current invites and requests to join a group and cancel, accept or reject them.
- __Inline Comments:__ Comments can be nested undearneath other comments.
- __Create Button:__ New button in the group navigation menu to create a post or a group within the current group.
- __Tour__: A tour for new users to introduce the basics of Hylo when you first join

### Changed
- Upgraded Projects to have location and times, appear on map, and show completion.
- Networks with communities in them have been converted into Groups with sub-groups inside them.
- The navigation drawer now shows a flat alphabetical lst of all Groups you are a part of.
- New group creation modal replaces the old community creation wizard. It now allows you to set the visibility and accessibility of the group as well as select one or more parent groups for the new group.
- Almost all of Hylo's routes have changed, in part to reflect the switch from communities and networks to groups, but also to make them more clear.
- Everywhere we show a list of groups we now sort them alphabetically. This includes in the group selector when creating a post, and in the affiliations lists on user profiles and in the user settings.
- The save button on the user and group settings pages now sticks to the bottom of the viewport so it is always visible and more clear when something needs to be saved.
- You can now create a Project or Event from the regular post creation modal instead of having to go to the Projects or Events section to do so.
- Much nicer signup wizard with welcome dialog that directs you to different things you can do
- Many small fixes and improvements to the UI on mobile web.

### Fixes
- Show posts in the public stream for users that dont have any groups yet.
- The notification when you are invited to an event now correctly links to that event

## [2.2.5] - 2021-02-01
### Added
- Link to Terms of Service and Privacy policy in the account menu
- React Testing Library (internal)

### Changed
- Upgrade Redux 3.x < 4.x (internal)
- Upgrade React Router 4.x > 5.x (internal)
- Upgrade Jest v23 > v26 (including enzyme, etc) (internal)
- Upgrade Node v12 > v15 (internal)
- Applies latest heroku-buildpack-nodejs (internal)
- Community Leaders now called Community Moderators in the community sidebar

### Fixed
- Not being able to turn on or off notifications for communities
- Initial load of Member Profile Edit takes too long #706
- Navigating to a topic from All Topics goes nowhere #747
- Navigating to a topic that doesn't exists goes into infinite loading state #744
- Avatar images not appearing for communities in the navigation drawer
- Error when trying to view profile of member you aren't allowed to see

### Added
- Removed Skills slide from account signup wizard.
- Added Terms & Privacy link to menu.

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
