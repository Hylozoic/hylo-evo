import { attr, fk, many, Model } from 'redux-orm'

export const PostFollower = Model.createClass({})
PostFollower.modelName = 'PostFollower'
PostFollower.fields = {
  post: fk('Post', 'postfollowers'),
  follower: fk('Person', 'postfollowers')
}

export const PostCommenter = Model.createClass({})
PostCommenter.modelName = 'PostCommenter'
PostCommenter.fields = {
  post: fk('Post', 'postcommenters'),
  commenter: fk('Person', 'postcommenters')
}

const Post = Model.createClass({
  toString () {
    return `Post: ${this.name}`
  }
})

export default Post

Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  title: attr(),
  type: attr(),
  details: attr(),
  creator: fk('Person', 'createdPosts'),
  followers: many({
    to: 'Person',
    relatedName: 'posts',
    through: 'PostFollower',
    throughFields: [ 'post', 'follower' ]
  }),
  communities: many('Community'),
  communitiesTotal: attr(),
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
