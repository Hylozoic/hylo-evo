import { attr, many, Model } from 'redux-orm'
import { get, isEmpty } from 'lodash/fp'

// MessageThread functions

export function participantAttributes (messageThread, currentUser, maxShown) {
  const currentUserId = get('id', currentUser)
  const participants = messageThread.participants.toRefArray
    ? messageThread.participants.toRefArray()
    : messageThread.participants
  const filteredParticipants = participants.filter(p => p.id !== currentUserId)
  var names, avatarUrls

  if (isEmpty(filteredParticipants)) {
    avatarUrls = [get('avatarUrl', currentUser)]
    names = 'You'
  } else {
    avatarUrls = filteredParticipants.map(p => p.avatarUrl)
    names = formatNames(filteredParticipants.map(p => p.name), maxShown)
  }

  return { names, avatarUrls }
}

export function isUnread (messageThread) {
  const { lastReadAt, updatedAt } = messageThread

  return lastReadAt === undefined || new Date(lastReadAt) < new Date(updatedAt)
}

export function isUpdatedSince (messageThread, date) {
  return new Date(messageThread.updatedAt) > date
}

// Utility

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

export function others (n) {
  if (n < 0) {
    return ''
  } else if (n === 1) {
    return '1 other'
  } else {
    return `${n} others`
  }
}

// ReduxORM Model

const MessageThread = Model.createClass({
  isUnread () {
    return isUnread(this)
  },

  isUpdatedSince (date) {
    return isUpdatedSince(this, date)
  },

  toString () {
    return `MessageThread: ${this.id}`
  },

  // TODO: Figure-out how to handle this correctly outside of ReduxORM
  newMessageReceived (bumpUnreadCount) {
    const update = bumpUnreadCount
      ? { unreadCount: this.unreadCount + 1, updatedAt: new Date().toString() }
      : { updatedAt: new Date().toString() }
    this.update(update)
    return this
  },
  
  // TODO: Figure-out how to handle this correctly outside of ReduxORM
  markAsRead () {
    this.update({
      unreadCount: 0,
      lastReadAt: new Date().toString()
    })
    return this
  },

  participantAttributes (currentUser, maxShown) {
    return participantAttributes(this.toRefArray(), currentUser, maxShown)
  }
})

export default MessageThread

MessageThread.modelName = 'MessageThread'

MessageThread.fields = {
  id: attr(),
  unreadCount: attr(),
  participants: many('Person'),
  updatedAt: attr(),
  lastReadAt: attr()
}
