import { attr, many, Model } from 'redux-orm'
import { get, isEmpty } from 'lodash/fp'

const MessageThread = Model.createClass({
  isUnread () {
    return this.lastReadAt === undefined || new Date(this.lastReadAt) < new Date(this.updatedAt)
  },

  isUpdatedSince (date) {
    return new Date(this.updatedAt) > date
  },

  toString () {
    return `MessageThread: ${this.id}`
  },

  newMessageReceived (bumpUnreadCount) {
    const update = bumpUnreadCount
      ? {unreadCount: this.unreadCount + 1, updatedAt: new Date().toString()}
      : {updatedAt: new Date().toString()}
    this.update(update)
    return this
  },

  markAsRead () {
    this.update({
      unreadCount: 0,
      lastReadAt: new Date().toString()
    })
    return this
  },

  participantAttributes (currentUser, maxShown) {
    const currentUserId = get('id', currentUser)
    const participants = this.participants.toRefArray()
    .filter(p => p.id !== currentUserId)
    var names, avatarUrls

    if (isEmpty(participants)) {
      avatarUrls = [get('avatarUrl', currentUser)]
      names = 'You'
    } else {
      avatarUrls = participants.map(p => p.avatarUrl)
      names = formatNames(participants.map(p => p.name), maxShown)
    }

    return {names, avatarUrls}
  }
})

export function others (n) {
  if (n < 0) {
    return ''
  } else if (n === 1) {
    return '1 other'
  } else {
    return `${n} others`
  }
}

export function formatNames (names, maxShown) {
  const length = names.length
  const truncatedNames = (maxShown && maxShown < length)
    ? names.slice(0, maxShown).concat([others(length - maxShown)])
    : names

  const last = truncatedNames.pop()
  if (isEmpty(truncatedNames)) {
    return last
  } else {
    return truncatedNames.join(', ') + ` and ${last}`
  }
}

export default MessageThread

MessageThread.modelName = 'MessageThread'

MessageThread.fields = {
  id: attr(),
  unreadCount: attr(),
  participants: many('Person'),
  updatedAt: attr(),
  lastReadAt: attr()
}
