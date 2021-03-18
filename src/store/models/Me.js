import { find, get, includes } from 'lodash/fp'
import PropTypes from 'prop-types'
import { attr, fk, many, Model } from 'redux-orm'
import featureFlag from 'config/featureFlags'
import { toRefArray } from 'util/reduxOrmMigration'

export function firstName (user) {
  return user.name ? user.name.split(' ')[0] : null
}

export function canModerate (memberships, group) {
  const matchedMembership = find(
    m => m.group === get('id', group),
    toRefArray(memberships)
  )

  return get('hasModeratorRole', matchedMembership)
}

export function isTester (userId) {
  const testerIds = process.env.HYLO_TESTER_IDS && process.env.HYLO_TESTER_IDS.split(',')

  return includes(userId, testerIds)
}

export function hasFeature (key, isTester = false) {
  if (!key) throw new Error("Can't call hasFeature without a user and a key")

  const flag = featureFlag(key)

  switch (flag) {
    case 'on':
      return true
    case 'testing':
      return isTester
    default:
      return false
  }
}

export const CURRENT_USER_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_user_banner.jpg'

class Me extends Model {
  toString () {
    return `Me: ${this.name}`
  }

  firstName () {
    return firstName(this)
  }

  canModerate (group) {
    return canModerate(this.memberships, group)
  }

  hasFeature (key) {
    return hasFeature(key, isTester(this.id))
  }
}

export class MySkillsToLearn extends Model {}
MySkillsToLearn.modelName = 'MySkillsToLearn'
MySkillsToLearn.fields = {
  me: fk('Me', 'mySkillsToLearn'),
  skillToLearn: fk('Skill', 'mySkillsToLearn')
}

export default Me

Me.modelName = 'Me'
Me.fields = {
  isAdmin: attr(),
  name: attr(),
  posts: many('Post'),
  intercomHash: attr(),
  joinRequests: many('JoinRequest'),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),

  // strictly speaking, a membership belongs to a single person, so it's not a
  // many-to-many relationship. but putting this here ensures that when we have
  // a query on the current user that contains memberships, the data will be
  // properly extracted and stored for the user.
  memberships: many('Membership'),

  messageThreads: many('MessageThread'),
  notifications: many('Notification'),
  skills: many('Skill'),
  skillsToLearn: many({
    to: 'Skill',
    relatedName: 'personLearning',
    through: 'MySkillsToLearn',
    throughFields: [ 'me', 'skillToLearn' ]
  }),
  blockedUsers: many('Person')
}
