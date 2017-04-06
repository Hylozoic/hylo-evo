import { attr, fk, many, Model } from 'redux-orm'

export class PostFollower extends Model {}
PostFollower.modelName = 'PostFollower'
PostFollower.fields = {
  post: fk('Post', 'postfollowers'),
  follower: fk('Person', 'postfollowers')
}

export class PostCommenter extends Model {}
PostCommenter.modelName = 'PostCommenter'
PostCommenter.fields = {
  post: fk('Post', 'postcommenters'),
  commenter: fk('Person', 'postcommenters')
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
  commenters: many({
    to: 'Person',
    relatedName: 'posts2',
    through: 'PostCommenter',
    throughFields: [ 'post', 'commenter' ]
  }),
  commentersTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr(),
  votesTotal: attr()
}
