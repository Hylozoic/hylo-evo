import { attr, many, Model } from 'redux-orm'

const MessageThread = Model.createClass({
  toString () {
    return `MessageThread: ${this.id}`
  },
  bumpUnreadCount () {
    this.update({
      unreadCount: this.unreadCount + 1
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
