import { attr, many, Model } from 'redux-orm'

const MessageThread = Model.createClass({
  toString () {
    return `MessageThread: ${this.id}`
  }
})

export default MessageThread

MessageThread.modelName = 'MessageThread'

MessageThread.fields = {
  id: attr(),
  participants: many('Person'),
  messages: many('Message')
}
