import { attr, many, Model, fk } from 'redux-orm'

export const CommunityModerator = Model.createClass({})
CommunityModerator.modelName = 'CommunityModerator'
CommunityModerator.fields = {
  community: fk('Community', 'communitymoderators'),
  moderator: fk('Person', 'communitymoderators')
}

const Community = Model.createClass({
  toString () {
    return `Community: ${this.name}`
  }
})

export default Community

Community.modelName = 'Community'

Community.fields = {
  id: attr(),
  name: attr(),
  members: many('Person'),
  moderators: many({
    to: 'Person',
    relatedName: 'communityModerated',
    through: 'CommunityModerator',
    throughFields: [ 'community', 'moderator' ]
  }),
  feedItems: many('FeedItem'),
  posts: many('Post'),
  postCount: attr(),
  feedOrder: attr(),
  topicSubscriptions: many('TopicSubscription')
}
