import { attr, many, Model, fk } from 'redux-orm'

export const GROUP_ACCESSIBILITY = {
  Closed: 0,
  Restricted: 1,
  Open: 2
}

export const GROUP_TYPES = {
  default: null,
  farm: 'farm'
}

export function accessibilityDescription (a) {
  switch (a) {
    case GROUP_ACCESSIBILITY.Closed:
      return 'This group is invitation only'
    case GROUP_ACCESSIBILITY.Restricted:
      return 'People can apply to join this group and must be approved'
    case GROUP_ACCESSIBILITY.Open:
      return 'Anyone who can see this group can join it'
  }
}

export function accessibilityIcon (a) {
  switch (a) {
    case GROUP_ACCESSIBILITY.Closed:
      return 'Lock'
    case GROUP_ACCESSIBILITY.Restricted:
      return 'Hand'
    case GROUP_ACCESSIBILITY.Open:
      return 'Enter-Door'
  }
}

export const GROUP_VISIBILITY = {
  Hidden: 0,
  Protected: 1,
  Public: 2
}

export function visibilityDescription (v) {
  switch (v) {
    case GROUP_VISIBILITY.Hidden:
      return 'Only members of this group or direct child groups can see it'
    case GROUP_VISIBILITY.Protected:
      return 'Only members of this group or direct parent or child groups can see this group'
    case GROUP_VISIBILITY.Public:
      return 'Anyone can find and see this group'
  }
}

export function visibilityIcon (v) {
  switch (v) {
    case GROUP_VISIBILITY.Hidden:
      return 'Hidden'
    case GROUP_VISIBILITY.Protected:
      return 'Shield'
    case GROUP_VISIBILITY.Public:
      return 'Public'
  }
}

export const accessibilityString = (accessibility) => {
  return Object.keys(GROUP_ACCESSIBILITY).find(key => GROUP_ACCESSIBILITY[key] === accessibility)
}

export const visibilityString = (visibility) => {
  return Object.keys(GROUP_VISIBILITY).find(key => GROUP_VISIBILITY[key] === visibility)
}

export const LOCATION_PRECISION = {
  precise: 'Display exact location',
  near: 'Display only nearest city and show nearby location on the map',
  region: 'Display only nearest city and dont show on the map'
}

export class GroupModerator extends Model { }
GroupModerator.modelName = 'GroupModerator'
GroupModerator.fields = {
  group: fk('Group', 'groupmoderators'),
  moderator: fk('Person', 'groupmoderators')
}

export class GroupJoinQuestion extends Model { }
GroupJoinQuestion.modelName = 'GroupJoinQuestion'
GroupJoinQuestion.fields = {
  id: attr(),
  questionId: attr(),
  text: attr(),
  group: fk('Group')
}

export class GroupToGroupJoinQuestion extends Model { }
GroupToGroupJoinQuestion.modelName = 'GroupToGroupJoinQuestion'
GroupToGroupJoinQuestion.fields = {
  id: attr(),
  questionId: attr(),
  text: attr(),
  group: fk('Group')
}

export class GroupTopic extends Model {}
GroupTopic.modelName = 'GroupTopic'
GroupTopic.fields = {
  group: fk('Group', 'grouptopics'),
  topic: fk('Topic', 'grouptopics')
}

export class GroupRelationship extends Model {}
GroupRelationship.modelName = 'GroupRelationship'
GroupRelationship.fields = {
  parentGroup: fk({ to: 'Group', as: 'parentGroup', relatedName: 'childRelationships' }),
  childGroup: fk({ to: 'Group', as: 'childGroup', relatedName: 'parentRelationships' })
}

export class GroupPrerequisite extends Model {}
GroupPrerequisite.modelName = 'GroupPrerequisite'
GroupPrerequisite.fields = {
  prerequisiteGroup: fk({ to: 'Group', as: 'prerequisiteGroup', relatedName: 'antireqs' }),
  forGroup: fk({ to: 'Group', as: 'forGroup', relatedName: 'prereqs' })
}

class Group extends Model {
  toString () {
    return `Group: ${this.name}`
  }
}

export default Group

Group.modelName = 'Group'

Group.fields = {
  accessibility: attr(),
  activeProjects: many({
    to: 'Post',
    as: 'activeProjects',
    relatedName: 'activeProjectGroups'
  }),
  agreements: many('Agreement'),
  announcements: many({
    to: 'Post',
    as: 'announcements',
    relatedName: 'announcementGroups'
  }),
  childGroups: many({
    to: 'Group',
    relatedName: 'parentGroups',
    through: 'GroupRelationship',
    throughFields: ['childGroup', 'parentGroup']
  }),
  customViews: many('CustomView'),
  feedOrder: attr(),
  geoShape: attr(),
  groupToGroupJoinQuestions: many('GroupToGroupJoinQuestion'),
  id: attr(),
  joinQuestions: many('GroupJoinQuestion'),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  members: many('Person'),
  memberCount: attr(),
  moderators: many({
    to: 'Person',
    relatedName: 'moderatedGroups',
    through: 'GroupModerator',
    throughFields: ['group', 'moderator']
  }),
  moderatorDescriptor: attr(),
  moderatorDescriptorPlural: attr(),
  name: attr(),
  openOffersAndRequests: many({
    to: 'Post',
    as: 'openOffersAndRequests',
    relatedName: 'groupsWithOffersAndRequests'
  }),
  posts: many('Post'),
  postCount: attr(),
  prerequisiteGroups: many({
    to: 'Group',
    relatedName: 'antirequisiteGroups',
    through: 'GroupPrerequisite',
    throughFields: [ 'prerequisiteGroup', 'forGroup' ]
  }),
  purpose: attr(),
  settings: attr(),
  slug: attr(),
  suggestedSkills: many('Skill'),
  upcomingEvents: many({
    to: 'Post',
    as: 'upcomingEvents',
    relatedName: 'eventGroups'
  }),
  visibility: attr(),
  widgets: many('Widget')
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const ALL_GROUPS_ID = 'all-groups'
export const ALL_GROUPS_AVATAR_PATH = '/assets/white-merkaba.svg'

export const GROUP_EXPLORER_ID = 'group-explorer'
export const GROUP_EXPLORER_AVATAR_PATH = '/assets/group-explorer.svg'

export const PUBLIC_MAP_ID = 'public-map'
export const PUBLIC_MAP_AVATAR_PATH = '/assets/earth.svg'

export const PUBLIC_CONTEXT_ID = 'public-context'
export const PUBLIC_CONTEXT_AVATAR_PATH = '/public.svg'

export const MY_HOME_ID = 'my-home'
export const MY_HOME_AVATAR_PATH = '/my-home.svg'
