import { attr, fk, Model } from 'redux-orm'

const Comment = Model.createClass({
  toString () {
    return `Comment: ${this.name}`
  }
})

export default Comment

Comment.modelName = 'Comment'

Comment.fields = {
  id: attr(),
  text: attr(),
  creator: fk('Person', 'comments'),
  post: fk('Post', 'comments'),
  createdAt: attr()
}
