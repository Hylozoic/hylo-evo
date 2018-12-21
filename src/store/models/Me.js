import PropTypes from 'prop-types'
import { attr, many, Model } from 'redux-orm'
import { find, get } from 'lodash/fp'

const Me = Model.createClass({
  toString () {
    return `Me: ${this.name}`
  },

  firstName () {
    return this.name ? this.name.split(' ')[0] : null
  },

  canModerate (community) {
    const memberships = this.memberships.toRefArray
      ? this.memberships.toRefArray()
      : this.memberships
    const membership = find(m =>
      m.community === get('id', community), memberships)
    return get('hasModeratorRole', membership)
  }
})

export default Me

Me.modelName = 'Me'
Me.fields = {
  isAdmin: attr(),
  name: attr(),
  posts: many('Post'),
  intercomHash: attr(),

  // strictly speaking, a membership belongs to a single person, so it's not a
  // many-to-many relationship. but putting this here ensures that when we have
  // a query on the current user that contains memberships, the data will be
  // properly extracted and stored for the user.
  memberships: many('Membership'),

  messageThreads: many('MessageThread'),
  notifications: many('Notification'),
  skills: many('Skill'),
  blockedUsers: many('Person')
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
