import { attr, fk, Model } from 'redux-orm'

class Comment extends Model {
  toString () {
    return `Comment: ${this.name}`
  }
}

export default Comment

Comment.modelName = 'Comment'

Comment.fields = {
  id: attr(),
  text: attr(),
  creator: fk('Person', 'comments'),
  post: fk('Post', 'comments'),
  createdAt: attr()
}
