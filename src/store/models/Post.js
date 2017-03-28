import { attr, fk, many, Model } from 'redux-orm'

export class PostFollower extends Model {}
PostFollower.modelName = 'PostFollower'
PostFollower.fields = {
  post: fk('Post', 'postfollowers'),
  follower: fk('Person', 'postfollowers')
}

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  title: attr(),
  type: attr(),
  details: attr(),
  creator: fk('Person'),
  followers: many({
    to: 'Person',
    relatedName: 'posts',
    through: 'PostFollower',
    throughFields: [ 'post', 'follower' ]
  }),
  communities: many('Community'),
  communitiesTotal: attr(),
  comments: many('Comment'),
  commentsTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr()
}
