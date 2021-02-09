import { attr, many, Model, fk } from 'redux-orm'

export const GROUP_ACCESSIBILITY = {
  CLOSED: 0,
  RESTRICTED: 1,
  OPEN: 2
}

export const GROUP_VISIBILITY = {
  HIDDEN: 0,
  PROTECTED: 1,
  PUBLIC: 2
}

export class GroupModerator extends Model { }
GroupModerator.modelName = 'GroupModerator'
GroupModerator.fields = {
  group: fk('Group', 'groupmoderators'),
  moderator: fk('Person', 'groupmoderators')
}

export class GroupTopic extends Model {}
GroupTopic.modelName = 'GroupTopic'
GroupTopic.fields = {
  group: fk('Group', 'grouptopics'),
  topic: fk('Topic', 'grouptopics')
}

export class GroupConnection extends Model {}
GroupConnection.modelName = 'GroupConnection'
GroupConnection.fields = {
  parentGroup: fk({ to: 'Group', as: 'parent', relatedName: 'childConnections' }),
  childGroup: fk({ to: 'Group', as: 'child', relatedName: 'parentConnections' })
}

export class GroupWidget extends Model {}
GroupWidget.modelName = 'GroupWidget'
GroupWidget.fields = {
  group: fk({ to: 'Group', as: 'parent', relatedName: 'childConnections' }),
  widget: fk({ to: 'Group', as: 'child', relatedName: 'parentConnections' })
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
  childGroups: many({
    to: 'Group',
    relatedName: 'parentGroups',
    through: 'GroupConnection',
    throughFields: [ 'parentGroup', 'childGroup' ]
  }),
  feedOrder: attr(),
  id: attr(),
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
    throughFields: [ 'group', 'moderator' ]
  }),
  name: attr(),
  posts: many('Post'),
  postCount: attr(),
  settings: attr(),
  slug: attr(),
  visibility: attr(),
  widgets: many('Widget'),
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const ALL_GROUPS_ID = 'all-groups'
export const ALL_GROUPS_AVATAR_PATH = '/assets/white-merkaba.png'

export const PUBLIC_CONTEXT_ID = 'public-context'
export const PUBLIC_CONTEXT_AVATAR_PATH = '/public.svg'
