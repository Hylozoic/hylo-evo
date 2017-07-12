import { attr, many, Model } from 'redux-orm'

const Network = Model.createClass({
  toString () {
    return `Network: ${this.name}`
  }
})

export default Network

Network.modelName = 'Network'

Network.fields = {
  id: attr(),
  name: attr(),
  description: attr(),
  avatarUrl: attr(),
  bannerUrl: attr(),
  moderators: many('Person'),
  communities: many('Community')
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'

export const avatarUploadSettings = ({ id, slug }) => ({
  id: slug,
  subject: 'network-avatar',
  path: `network/${id}/avatar`,
  convert: {width: 160, height: 160, fit: 'crop', rotate: 'exif'}
})

export const bannerUploadSettings = ({ id, slug }) => ({
  id: slug,
  subject: 'network-banner',
  path: `network/${id}/banner`,
  convert: {width: 1600, format: 'jpg', fit: 'max', rotate: 'exif'}
})
