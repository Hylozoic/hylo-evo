import { attr, fk, Model } from 'redux-orm'

export default class Comment extends Model {
  toString () {
    return `Comment: ${this.name}`
  }
}

Comment.modelName = 'Comment'

Comment.fields = {
  id: attr(),
  text: attr(),
  creator: fk('Person'),
  createdAt: attr()
}
