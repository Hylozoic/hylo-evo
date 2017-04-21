import { attr, fk, Model } from 'redux-orm'

const Comment = Model.createClass({
  toString () {
    return `Comment: ${this.name}`
  }
})

export default Comment

// export default class Comment extends Model {
//   toString () {
//     return `Comment: ${this.name}`
//   }
// }

Comment.modelName = 'Comment'

Comment.fields = {
  id: attr(),
  text: attr(),
  creator: fk('Person'),
  post: fk('Post', 'comments'),
  createdAt: attr()
}
