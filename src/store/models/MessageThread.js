import { attr, many, Model } from 'redux-orm'
import { get, isEmpty } from 'lodash/fp'
import { formatNames } from 'util/text'

const MessageThread = Model.createClass({
  isUnread () {
    const { lastReadAt, updatedAt } = this
    return lastReadAt === undefined || new Date(lastReadAt) < new Date(updatedAt)
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

export default MessageThread

MessageThread.modelName = 'MessageThread'

MessageThread.fields = {
  id: attr(),
  unreadCount: attr(),
  participants: many('Person'),
  updatedAt: attr(),
  lastReadAt: attr()
}
