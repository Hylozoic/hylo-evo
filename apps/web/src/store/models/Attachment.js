import { attr, fk, Model } from 'redux-orm'

class Attachment extends Model {
  toString () {
    return `Attachment (${this.type}): ${this.name}`
  }
}

export default Attachment

Attachment.modelName = 'Attachment'

Attachment.fields = {
  id: attr(),
  type: attr(),
  position: attr(),
  url: attr(),
  thumbnailUrl: attr(),
  post: fk('Post', 'attachments'),
  comment: fk('Comment', 'attachments'),
  createdAt: attr()
}
