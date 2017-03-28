import { attr, fk, many, Model } from 'redux-orm'

const fields = {
  id: attr(),
  title: attr(),
  type: attr(),
  details: attr(),
  creator: fk('Person'),
  // followers: many('Person'),
  communities: many('Community'),
  communitiesTotal: attr(),
  comments: many('Comment'),
  commentsTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr()
}

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

Post.modelName = 'Post'
Post.fields = fields
