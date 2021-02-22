import { attr, many, Model, fk } from 'redux-orm'

export const GROUP_ACCESSIBILITY = {
  Closed: 0,
  Restricted: 1,
  Open: 2
}

export function groupAccessibilityDescription (a) {
  switch (a) {
    case GROUP_ACCESSIBILITY.Closed:
      return 'Require new users to answer questions in order to join'
    case GROUP_ACCESSIBILITY.Restricted:
      return 'People who apply must be approved by moderators'
    case GROUP_ACCESSIBILITY.Open:
      return 'Anyone can join this group'
  }
}

export function groupAccessibilityIcon (a) {
  switch (a) {
    case GROUP_ACCESSIBILITY.Closed:
      return 'Search'
    case GROUP_ACCESSIBILITY.Restricted:
      return 'Search'
    case GROUP_ACCESSIBILITY.Open:
      return 'Search'
  }
}

export const GROUP_VISIBILITY = {
  Hidden: 0,
  Protected: 1,
  Public: 2
}

export function groupVisibilityDescription (v) {
  switch (v) {
    case GROUP_VISIBILITY.Hidden:
      return 'Only members of this group can see this group'
    case GROUP_VISIBILITY.Protected:
      return 'Only members of parent groups can see this group'
    case GROUP_VISIBILITY.Public:
      return 'Anyone can find and see this group'
  }
}

export function groupVisibilityIcon (v) {
  switch (v) {
    case GROUP_VISIBILITY.Hidden:
      return 'Search'
    case GROUP_VISIBILITY.Protected:
      return 'Search'
    case GROUP_VISIBILITY.Public:
      return 'Search'
  }
}

export class GroupModerator extends Model { }
GroupModerator.modelName = 'GroupModerator'
GroupModerator.fields = {
  group: fk('Group', 'groupmoderators'),
  moderator: fk('Person', 'groupmoderators')
}

export class GroupQuestion extends Model { }
GroupQuestion.modelName = 'GroupQuestion'
GroupQuestion.fields = {
  group: fk('Group', 'groupQuestions'),
  moderator: attr('text')
}

export class GroupQuestionAnswer extends Model { }
GroupQuestionAnswer.modelName = 'GroupQuestionAnswer'
GroupQuestionAnswer.fields = {
  answer: attr(),
  question: fk('GroupQuestion', 'answers'),
  user: fk('Person')
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
  questions: many('GroupQuestion'),
  settings: attr(),
  slug: attr(),
  visibility: attr()
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const ALL_GROUPS_ID = 'all-groups'
export const ALL_GROUPS_AVATAR_PATH = '/assets/white-merkaba.png'

export const PUBLIC_CONTEXT_ID = 'public-context'
export const PUBLIC_CONTEXT_AVATAR_PATH = '/public.svg'

export const accessibilityString = (accessibility) => {
  return Object.keys(GROUP_ACCESSIBILITY).find(key => GROUP_ACCESSIBILITY[key] === accessibility)
}

export const visibilityString = (visibility) => {
  return Object.keys(GROUP_VISIBILITY).find(key => GROUP_VISIBILITY[key] === visibility)
}
