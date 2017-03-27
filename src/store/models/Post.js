import { attr, fk, many, Model } from 'redux-orm'

const fields = {
  id: attr(),
  name: attr(),
  creator: fk('Person'),
  communities: many('Community')
}

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

Post.modelName = 'Post'
Post.fields = fields
