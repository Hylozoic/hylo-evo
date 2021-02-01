import { attr, many, Model } from 'redux-orm'
import { filter, get, isEmpty } from 'lodash/fp'
import { toRefArray } from 'util/reduxOrmMigration'

// MessageThread functions

export function participantAttributes (messageThread, currentUser, maxShown) {
  const currentUserId = get('id', currentUser)
  const participants = toRefArray(messageThread.participants)
  const filteredParticipants = filter(p => p.id !== currentUserId, participants)
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

export function markAsRead (messageThreadInstance) {
  messageThreadInstance.update({
    unreadCount: 0,
    lastReadAt: new Date().toString()
  })

  return messageThreadInstance
}

export function newMessageReceived (messageThreadInstance, bumpUnreadCount) {
  const update = bumpUnreadCount
    ? { unreadCount: messageThreadInstance.unreadCount + 1, updatedAt: new Date().toString() }
    : { updatedAt: new Date().toString() }
  messageThreadInstance.update(update)
  return messageThreadInstance
}

// ReduxORM Model

class MessageThread extends Model {
  isUnread () {
    return isUnread(this)
  }

  isUpdatedSince (date) {
    return isUpdatedSince(this, date)
  }

  toString () {
    return `MessageThread: ${this.id}`
  }

  newMessageReceived (bumpUnreadCount) {
    return newMessageReceived(this, bumpUnreadCount)
  }

  markAsRead () {
    return markAsRead(this)
  }

  participantAttributes (currentUser, maxShown) {
    return participantAttributes(this, currentUser, maxShown)
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
