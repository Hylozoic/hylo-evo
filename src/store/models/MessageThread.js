import { attr, many, Model } from 'redux-orm'

const MessageThread = Model.createClass({
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
  }
})

export default MessageThread

MessageThread.modelName = 'MessageThread'

MessageThread.fields = {
  id: attr(),
  unreadCount: attr(),
  participants: many('Person')
}
