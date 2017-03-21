import { attr, fk, Model } from 'redux-orm'

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
  // Declare any static or instance methods you need.
}
Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  name: attr(),
  user_id: fk('Person')
  // communities: many('Community')
}
