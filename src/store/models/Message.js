import { attr, fk, Model } from 'redux-orm'

class Message extends Model {
  toString () {
    return `Message: ${this.id}`
  }
}

export default Message

Message.modelName = 'Message'

Message.fields = {
  id: attr(),
  text: attr(),
  creator: fk('Person'),
  createdAt: attr(),
  messageThread: fk('MessageThread', 'messages')
}
