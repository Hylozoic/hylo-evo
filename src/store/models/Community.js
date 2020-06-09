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
  slug: attr(),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  members: many('Person'),
  memberCount: attr(),
  moderators: many({
    to: 'Person',
    relatedName: 'moderatedCommunities',
    through: 'CommunityModerator',
    throughFields: [ 'community', 'moderator' ]
  }),
  name: attr(),
  network: fk('Network'),
  posts: many('Post'),
  postCount: attr(),
  feedOrder: attr(),
  allowCommunityInvites: attr()
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const ALL_COMMUNITIES_ID = 'all-communities'
export const ALL_COMMUNITIES_AVATAR_PATH = '/assets/white-merkaba.png'

export const PUBLIC_COMMUNITIES_ID = 'public-communities'
export const PUBLIC_COMMUNITIES_AVATAR_PATH = '/public.svg'
