import { attr, fk, many, Model } from 'redux-orm'
import PropTypes from 'prop-types'

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

export class ProjectMember extends Model {}
ProjectMember.modelName = 'ProjectMember'
ProjectMember.fields = {
  post: fk('Post', 'projectmembers'),
  member: fk('Person', 'projectmembers')
}

class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

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
  groups: many('Group'),
  groupsTotal: attr(),
  postMemberships: many('PostMembership'),
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
  topics: many('Topic'),
  isPublic: attr()
}

export const POST_TYPES = {
  'discussion': {
    primaryColor: [0, 163, 227, 255], // $color-picton-blue
    backgroundColor: 'rgba(0, 163, 227, .2)', // $color-link-water
    map: true,
    description: 'Talk about what’s important with others'
  },
  'request': {
    primaryColor: [102, 75, 165, 255], // $color-persimmon;
    backgroundColor: 'rgba(102, 75, 165, .2)', // $color-peach-schnapps;
    map: true,
    description: 'What can people help you with?'
  },
  'offer': {
    primaryColor: [0, 199, 157, 255], // $color-caribbean-green
    backgroundColor: 'rgba(0, 199, 157, .2)', // $color-iceberg;
    map: true,
    description: 'What do you have for others?'
  },
  'resource': {
    primaryColor: [255, 212, 3, 255], // $color-mango-yellow;
    backgroundColor: 'rgba(255, 212, 3, .2)',
    map: true,
    description: 'Let people know about available resources'
  },
  'project': {
    primaryColor: [252, 128, 0, 255], // $color-fuchsia-pink;
    backgroundColor: 'rgba(252, 128, 0, .2)', // $color-prim;
    map: true,
    description: 'Create a project that people can help with'
  },
  'event': {
    primaryColor: [254, 72, 80, 255], // $color-medium-purple
    backgroundColor: 'rgba(254, 72, 80, .2)', // $color-moon-raker
    map: true,
    description: 'Invite people to your event'
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
  groups: PropTypes.array,
  isPublic: PropTypes.bool
}
