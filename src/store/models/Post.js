import { attr, fk, many, Model } from 'redux-orm'
import PropTypes from 'prop-types'

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

export const ProjectMember = Model.createClass({})
ProjectMember.modelName = 'ProjectMember'
ProjectMember.fields = {
  post: fk('Post', 'projectmembers'),
  member: fk('Person', 'projectmembers')
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
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  details: attr(),
  linkPreview: fk('LinkPreview', 'posts'),
  creator: fk('Person', 'posts'),
  followers: many({
    to: 'Person',
    relatedName: 'postsFollowing',
    through: 'PostFollower',
    throughFields: [ 'post', 'follower' ]
  }),
  communities: many('Community'),
  postMemberships: many('PostMembership'),
  communitiesTotal: attr(),
  commenters: many({
    to: 'Person',
    relatedName: 'postsCommented',
    through: 'PostCommenter',
    throughFields: [ 'post', 'commenter' ]
  }),
  members: many({
    to: 'Person',
    relatedName: 'projectsJoined',
    through: 'ProjectMember',
    throughFields: [ 'post', 'member' ]
  }),
  commentersTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr(),
  votesTotal: attr(),
  myVote: attr(),
  topics: many('Topic')
}

export const POST_TYPES = {
  'discussion': {
    primaryColor: '#40A1DD', // $color-picton-blue
    backgroundColor: '#D9ECF8' // $color-link-water
  },
  'event': {
    primaryColor: '#9883E5', // $color-medium-purple
    backgroundColor: '#EAE6FA' // $color-moon-raker
  },
  'offer': {
    primaryColor: '#0DC39F', // $color-caribbean-green
    backgroundColor: '#CFF3EC' // $color-iceberg;
  },
  'resource': {
    primaryColor: '#FDD549', // $color-mango-yellow;
    backgroundColor: '' // TODO: how to convert this? rgba($color-mango-yellow, 0.15) // $color-mango-yellow-15;
  },
  'project': {
    primaryColor: '#BB60A8', // $color-fuchsia-pink;
    backgroundColor: '#F1DFEE' // $color-prim;
  },
  'request': {
    primaryColor: '#FE6848', // $color-persimmon;
    backgroundColor: '#FFE1DA' // $color-peach-schnapps;
  }
}

export const POST_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string,
  title: PropTypes.string,
  details: PropTypes.string,
  location: PropTypes.string,
  locationObject: PropTypes.object,
  name: PropTypes.string,
  upVotes: PropTypes.string,
  updatedAt: PropTypes.string,
  imageUrl: PropTypes.string,
  linkPreview: PropTypes.object,
  communities: PropTypes.array
}
