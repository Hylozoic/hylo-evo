# Changelog
All notable changes to Hylo Evo (the Hylo front-end) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [5.5.3] - 2023-05-27

### Fixed
- Mispelling of Discussion in create modal
- Fix display of member posts on user profile
- Group Details page:
  - Always show privacy settings in main body, instead of ugly, random text describing accessibility setting
  - Hide Posts and members in body for now since we never show anything there
  - Move member count to header
  - Add header text asking people to answer join questions
- Fix closing about info pane from Explore page

## [5.5.2] - 2023-05-27

### Fixed
- Don't lose map filter when closing a post in the map drawer
- Fix display of map when not logged in and hideNav is on

## [5.5.1] - 2023-05-18

### Fixed
- Correct routing for public posts when viewing while not logged in. All post URLs will now redirect to https://hylo.com/post/:postId
- Remove all ways one could try to interact with a public post when not logged in
- Fix close button when viewing a post at https://hylo.com/post/:postId
- Fix viewing member profile of currently logged in user outside of a group context, i.e. at url https://hylo.com/members/:id

## [5.5.0] - 2023-05-12

### Added
- Beta of Internationalization support! First pass of translation into Spanish. Users can select their language using a new menu item, and that will be saved for the future.

### Fixed
- Fix close button when viewing posts or groups when not logged in and looking at the public map or group explorer

## [5.4.2] - 2023-05-04

### Added
- Show badges next to moderators in group sidebar
- Send button to all comment forms

### Changed
- Tweaked styling of group cards so they are not too big and show first two lines of description

## [5.4.1] - 2023-04-13

### Fixed
- Duplicate topics appearing in topic selector.
- Order of topics in topic selector now correctly showing more popular ones at the top
- Get Hylo working in iframes in Safari (requires using Storage Access API)

## [5.4.0] - 2023-03-15

### Added
- New group Roles and Badges! Admins can add roles/badges which are an emoji and a name, and then attach them to group members. These appear next to the member's name everywhere in the group.

### Changed
- Stop showing group topic pills in group explorer for now
- Hide childPost toggle when appropriate, in mapExplorer

### Fixed
- Posts with images have link to the first image covering the whole post, so you can't click on links in the post
- When not logged in and viewing a /groups/* page either show the public groups page for public groups, or redirect to login, instead of redirecting to the public map
- When redirecting to /login for non public group or post make sure to include correct returnToUrl

## [5.3.5] - 2023-03-04

### Added
- New product categories for farms: grains, other_row_crops

### Changed
- Small styling tweaks to notifications, selected comments, and post details

## [5.3.4] - 2023-02-15

### Added
- New Mixpanel events to track full Signup funnel, Event RSVPs and Post opens
- Track the group(s) associated with every user and every event in Mixpanel. This paves the way for group admins to have access to group analytics through Mixpanel

## [5.3.3] - 2023-02-14

### Fixed
- Double chat creation when enter is hit twice quickly
- Editing a chat post would cause it to disappear

## [5.3.2] - 2023-02-08

### Changed
- Allow for Skills & Interests with spaces and up to 30 characters

### Fixed
- Bug viewing direct messages when there's one from a deleted user
- Don't show location twice on event cards

## [5.3.1] - 2023-02-03

### Changed
- More improvements to <title> tags for various pages in Hylo
- Post cards appear with a max width in chat rooms so they dont take up the whole screen

## [5.3.0] - 2023-01-30

### Added
- Support for oAuth Authorization Code flow!
 - Skip login screen for already logged in users, but still get new auth code from the server.
 - If prompt = consent always show the Consent screen even when already have given consent previously.
 - Display previous auth message if person has previously authed with Hylo
 - Display when an app is asking for offline_access

## [5.2.0] - 2023-01-20

### Added
- My Home context with 4 new views: __My Posts__ to see all posts you created, __Interactions__ to see all posts you have commented on or reacted to, __Mentions__ to see all posts you have been mentioned in, and __Announcements__ to see all announcements made in all groups you are a member of.
- A toggle to turn on or off the aggregated display of posts from child groups, that you are a member of, in the stream of the parent group
- Visual display to indicate which posts appearing in the stream are being aggregated from child groups (that you are a member of)
- Link to our Open Collective called Contribute to Hylo added to top nav menu

### Changed
- Mentions of the current logged in user now display as a different (yellow/orange) color than other mentions
- Update farm product categories ontology list to include "Other"
- Improved styling and user experience for notifications settings page

### Fixed
- Display of public map for non logged in users
- As a non-logged in person, navigating to a link for a public post that includes the group context now correctly displays the post

## [5.1.2] - 2022-12-29

### Changed
- Prevent changing user name to blank in the user settings

### Fixed
- Infinite attempts to load more comments when viewing a post
- Inability to scroll down in navigation drawer when a post is open

## [5.1.1]

### Added
- First pass at more descriptive meta tags for various Hylo pages. New page titles will appear in browser tabs, search engines and link previews in other platforms.

### Changed
- Clicking on a "new post in #topic" notification takes you to the topic room
- Don't allow for showing chat posts in custom views

### Fixed
- Minor fixes to comment interface
- Don't show Chat as a post type option in create post modal
- Don't add new chat posts to the Stream

## [5.1.0]

### Added
- Topic streams are now Slack like chat rooms! You can do quick posts without a title, and scrolling happens from the bottom up, and it tracks the last post you read and takes you to that location when you come back.
- Emoji reactions on comments
- Clicking on a comment notification takes you to that comment in the post and highlights it
- Public group pages can now be viewed by non-logged-in users

### Changed
- Emoji reactions replace votes on posts
- Show custom create post prompt when filtering stream by Resource

## [5.0.6]

### Changed
- Adds Android AppLinking config file to `public/.well-known/assetlinks.json`
- Updated favicon

## [5.0.5] - 2022-11-23

### Fixed
- Newly created posts appear immediately in stream, as well as projects view and upcoming events view if appropriate
- Show post details when opening one from a topic stream in the /all context
- Make sure collection posts appear in Custom View settings

## [5.0.4] - 2022-11-23

### Fixed
- `CommentEditor` in HyloApp not expanding height after selecting Mention or Topic (HyloReactNative #614)

## [5.0.3] - 2022-11-16

### Added
- `groupDescription` is now "autolinked" making external links added in the markdown clickable, including proper handling of Hylo links, mention, and topic links (via application of `ClickCatcher`)
- Terms and Privacy Policy links added to Signup page

### Fixed
- Styling of `groupDescription` to eliminate extra vertical space between paragraphs
- Back button behavior in the case of `LandingPage` > "About Us"
- Unexpected underline appearing in some links in mobile
- Sticking hover state color on MapExplorer buttons in mobile

### Changed
- Added default of `all` to `groupSlug` prop of `ClickCatcher`, doesn't change current behavior
- Removes now unused `navigation#removeGroupFromUrl`

## [5.0.2] - 2022-10-27

### Changed
- Navigating from one group to another no longer stays on the same view you were looking at (explore, map, member directory...) it instead always goes to the new group's home page which is the Stream. This is a response to feedback from many folks that it was confusing to change groups and stay on the same view.

### Fixed
- Bold text in a post now actually looks bold
- We now currectly show the current context in the navigation drawer

## [5.0.1] - 2022-10-24

### Fixed
- Update `hylo-shared` to fix bug in Mention HTML generation

## [5.0.0] - 2022-10-24

### Added
- "Featured" feature such that link previews which are a video can optionally (by default) be presented atop a Post as a embedded playable video
- `HyloEditorMobile`, a WebView-targetted version of `HyloEditor` now used in the Post and Comment editors in HyloApp
- Refactors `TopicSelector` to be less confusing and ready to support filtering across multiple `groupsIds`
- `react-icons` allowing ad hoc use of common open source icon packs (using some FontAwesome icons for editor, etc)
- `*.css` files now recognized by WebPack and processed through CSSLoader, but not the SASS or PostCSS loaders
- Minimal TypeScript support (WIP)
- Post "Collections" to enable CustomViews that are curated sets of posts. Admins can add Collection CustomViews in the new Custom Views section of the Group Settings. Collections can be set to be "manually" sorted and then posts can be reordered by drag and drop.
- CustomViews of type 'post stream' can now specify a default view mode and sort but these can be changed by the user when looking at the Custom View.
- Add post stream search/filter feature. Click on the magnifying glass to enter a search term and filter any view of posts by that text.
- Add 'Abusive' as reason to flag a post

### Changed
- `HyloEditor` moves to being TipTap-based from draft-js and adds full-suite of rich text editing features
- Improves general Link Preview retrieval and display
- Link/`a` navigation handling within content is now now more consistent throughout
- Consolidates and normalizes ad hoc HTML parsing and presentation of `Post#details` and `Comment#details` (etc) and moves to backend
- Uses `HyloHTML` wrapper component for all cases where `dangerouslySetInnerHTML` was used previously
- BrowserList config changes to "default" (ref. https://github.com/Hylozoic/hylo-evo/pull/1258/files#r991717480)
- Patch and minor npm module dependency updates
- Topics stream and Projects view all use the same Stream component so they now have full Stream controls like sort and view mode
- Updated react-dnd to latest version and update AttachmentManager to use latest react-dnd.

### Fixed
- Fix display of group search menu so it isn't half covered
- Clicking on # people commented in post card opens the post details
- Fix error message when trying to create an invalid Affiliation

## [4.1.2] - 2022-09-15

### Fixed
- Bug that prevented editing a Project with an empty donation link or project management link
- Styling of donation and project management links for unknown websites
- Viewing of /post/:id URLs while logged in

## [4.1.1] - 2022-09-07

### Fixed
- Breakage when a farm has an unknown certification, instead just display it as its user entered data
- Styling of comments in activity section of user profile
- Remove group to group join request upon accepting it

## [4.1.0] - 2022-08-19

### Added
- Add Custom Views to the navigation bar for groups. These can either be a link to an external URL or a filtered view of posts in the group.
- Add a Project Management Link and Donations Link to Projects which display uniquely on Project posts. These use custom icons for certain websites like Trello, Asana, GitHub, PayPal, Open Collective and more.
- You can now view public posts even if not logged in to Hylo.
- Small and large Grid views for the Stream.
- Link to resend verification code on the verify email interface in case the first one did't come through or expired.
- New item in post menu to copy the post's current URL to the clipboard.

### Changed
- Many style improvements to posts to make them easier to read and interact with. Reorganized various information to make it easier to find
- Cleaned up style of search page
- Change the icon for the button to message someone from their profile to match the chat icon used elsewhere in the app
- Better handling of broken invite links for logged in users
- Increased visibility, readability, content density throughout the app
- Left navigation menu scroll behavior change, now the whole menu scrolls instead of just the topics
- Updated post cards to have better visual hierarchy, and to make it easier to see the content. Reorganized the header and footer.
- Updated the members page styles to bring it in line with other new styles, including updating the search input and giving the cards a shadow.

### Fixed
- Bug that could unset a location or group area polygon when saving group settings
- Setting of prerequisite groups
- Editing of welcome message on Explore view.

## [4.0.3] - 2022-07-05

### Added
- Ability to draw a region/area for a group to define its boundary. This region will display on the map when inside a group (not the publc map).
- Extended Collaboration options for farm groups

## [4.0.2] - 2022-06-11

### Added
- Hylo App WebView events/interface to `GroupDetail` and related components

### Changed
- Behaviour of "Opportunies to Connect" on Group Detail to create a New Message via Moderator personIds

## [4.0.1] - 2022-06-08

### Changed
- Mixpanel instance is moved out of Redux and Mixpanel identification is move into a `useEffect` on `AuthLayoutRouter`
- Hide showMore if not needed for farm details
- Redirect /public/groups to login screen

### Fixed
- Fixes: hylo.com takes users to static landing page, even if they are logged #1207
- Border radius on post type button on post editor

## [4.0.0] - 2022-05-24

### Added
- Our first custom group type - Farms! Right now farms can only be created through our API integration with OpenTEAM, by onboarding a farm through a SurveyStack survey using the Common Onboarding question set developed in relationship with OpenTEAM.
-- Display unique farm data from these common onboarding questions in a farm group's About/Details page
-- Add farm specific searching and filtering to the Group Explorer
- Add a widget for messaging all the moderators of a group you are not a member of so you can reach out about collaborating with that group. This also pre-fills a message based on the type of collaboration the person is looking for.
- Add a widget to display a group's location and posts on a map on the group details page
- UI supporting the oAuth 2.0 flow for Sign in With Hylo functionality
- Group setting to hide the custom "extension" data for custom group types like farm from the public.
- Ability to change the base layer of the map to several options including satellite and street view. This selection will be remembered across page loads.
- Ability to display indigenous territories as a layer on the map using data from native-land.ca
- New group setting to obfuscate a group's location on the map. Options are precise (show exact location), near (show location offset by a slight amount and display a location string that only shows city, region & country) or region (don't show a location on the map at all, and the location string shows only city, region & country). Group moderators always see the precise location and location display string.
- Add a group setting for an About Video which if it is a YouTube or Vimeo link displays the video embed above the group description in the about/details page/panel
- New group settings to change the word (and plural word) used to describe a Moderator within the group.
- New group setting to change the word used to describe the group type in the app. This cannot actually be set manually yet, only via the API.
- Added top level menu items to navigation drawer for Public Groups (Group Explorer) and Public Map and changed Public Groups & Posts to be Public Stream
- Click to create post from map now works in Mobile app

## Changed
- All Privacy & Access related group settings moved into their own Settings tab.
- Clicking add item to map a second time deactivates the add mode.

## Fixed
- Show all child groups when looking at the map within a group

## [3.6.0] - 2022-04-28

### Changed
- Major refactor of authorized vs non-authorized routing, see `RootRouter`, `AuthLayoutRouter`, and `NonAuthLayoutRouter`
- React Testing Library (RTL) setup simplified and notated

### Added
- Changes to authorization and authentication flow to accomodate related API changes
- Adds new RTL-based tests for new and existing components
- You can now click on the map to create posts at that location. Either click and hold for a couple seconds, or click the (+) button and then click on the map to add a post at that lat,lng on the map.
- Discussion posts now can have a location and appear on the map

### Fixed
- Date/time selector in posts always visible, never disappears below the screen

## [3.5.2] - 2022-03-28

### Fixed
- Display of member counts on groups in the create post modal
- Correctly display notification settings for new groups that have just been created

### Changed
- Update License to be GNU AGPLv3
- Sort groups alphabetically on notifications settings page

## [3.5.1] - 2022-03-15

### Fixed
- Can once again select suggested skills when joining a group that has that feature turned on

## [3.5.0] - 2022-03-08

### Added
- Bold and Italic inline formatting pop-up to Post Editor
- Make PostEditor in CreateModal cancellable with Escape key
- Adds minimal optional chaining support through `@babel/plugin-proposal-optional-chaining` (e.g. `thing1?.thing2` replacement for `lodash.get('thing2', thing1)`)

### Changed
- Updates PostEditor to automatically open a new `<p>` after an empty linebreak and always a `<br>` on entry of a Shift-Enter
- Move to re-written `hylo-shared` from `hylo-utils`
- Major version updates to `draft-js`, `draft-js-plugin-editor`, and related plugins
- Removal of extraneous and destructive input HTML sanitization (santization should on retrieval of content from API)
- Minor version updates to `babel`, `eslint`, and related dependencies including some relate configuration updates
- Handling of text preview in Messages and Notification dropdowns
- Treat Message.text as HTML (Comment#text is a backend sanitized HTML field)
- Code formatting: component returns and optionals (`(thing && ... <SomeComponent />))`) wrapped in `()` with linebreaks and related indentation on most components touched

### Fixed
- Linebreak handling between post editor and display for posts, comments, and messages
- Position of Mention and Topic selectors to low within PostEditor
- Numererous small text and links-in-text handling bugs

## [3.4.0] - 2022-02-23

### Added
- Tabs in the map drawer to see Groups and Members on the map separately from Posts.
- Ability to hide/show Groups on the map.
- Can sort map drawer posts by post date.
- Map parameters, including the center location and zoom, are now added to the URL as they change so you can copy and share an exact map URL with someone.

### Changed
- Load more posts on the map, more quickly.
- Searching on the map filters groups and members as well as posts.
- When adding people to a message, pressing enter without entering text first will jump straight to the message box.
- Searching on the map now ignores case.

### Fixed
- Searching for and jumping to a point location (like an address) on the map.
- When you have data in the create post modal and close it or click off of it, we now ask if you are sure whether you want to closed the modal or not before you lose the entered data.
- When creating a post in a topic stream add that topic to the post by default and stay in the current group/context.
- Allow for editing/deleting sub-comments on other people's comments.

## [3.3.0] - 2022-02-03

### Added
- Many improvements to Messages experience:
-- Render names of people in a message groups as links to user profiles
-- Only show people selector when focus is on the Add Person box
-- Make it more obvious when focus is on the Write Something box
-- Allow for using arrow keys to select a person without having to first type something
-- Add hover styling in thread list
-- Make it more obvious which current thread is being viewed
-- Names in the messages header are links to their profiles
-- Filter deleted users out of message contact lists and mentions suggest
- Added GraphQL config files for dev tools

### Changed
- When clicking on a group on the Groups page go to that group's Home, instead of going to that group's Groups page
- Switched to Node 16

### Fixed
- While loading messages view show Messages header immediately instead of weird All Groups context header

## [3.2.9] - 2022-01-25

### Fixed
- Crash when going to /settings/notifications and trying to change the setting for a group

## [3.2.8] - 2022-01-23

### Added
- WebPack bundle analyzer. To analyze bundle `yarn build` and once complete `yarn analyze`

### Changed
- Lazy load Messages and Notifications top menu items to improve initial load time and rendering
- Replaced deprecated node-sass dependency with sass (Dart SASS)
- Move to Node 16
- Change faker dependency used in tests, and remove deprecated feature that was causing it to be included in production bundle
- Clean-up package.json
- Minor WebPack optimization config changes

## [3.2.7] - 2022-01-22

### Fixed
- Remove extra whitespace on right side of Map on full browser windows

## [3.2.6] - 2022-01-21

### Changed
- Improve initial app load time: remove extra fields from current user query and parallel load current user alongside current group

## [3.2.5] - 2022-01-18

### Changed
- Minor tidy and refactor of mobile device checking code

### Fixed
- MapExplorer drawer hide mobile check corrected so that drawer shows again in web

## [3.2.4] - 2022-01-17

### Changed
- Hide MapExplorer drawer by default on mobile browsers and in Hylo App embed
- Allow MapExplorer Saved Searches navigation to happen when in Hylo App embed
- Fix hover state for MapExplorer on touch-based devices

## [3.2.3] - 2022-01-14

### Fixed
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
