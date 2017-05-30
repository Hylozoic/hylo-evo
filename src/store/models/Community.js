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
  posts: many('Post'),
  postCount: attr(),
  feedOrder: attr()
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const avatarUploadSettings = ({ id, slug }) => ({
  id: slug,
  subject: 'community-avatar',
  path: `community/${id}/avatar`,
  convert: {width: 160, height: 160, fit: 'crop', rotate: 'exif'}
})

export const bannerUploadSettings = ({ id, slug }) => ({
  id: slug,
  subject: 'community-banner',
  path: `community/${id}/banner`,
  convert: {width: 1600, format: 'jpg', fit: 'max', rotate: 'exif'}
})
