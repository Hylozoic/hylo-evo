import { attr, many, Model } from 'redux-orm'

const Me = Model.createClass({
  toString () {
    return `Me: ${this.name}`
  }
})

export default Me

Me.modelName = 'Me'
Me.fields = {
  name: attr(),
  posts: many('Post'),
  memberships: many('Membership')
}

export const avatarUploadSettings = person => ({
  id: person.id,
  subject: 'user-avatar',
  path: `user/${person.id}/avatar`,
  convert: {width: 200, height: 200, fit: 'crop', rotate: 'exif'}
})

export const bannerUploadSettings = person => ({
  id: person.id,
  subject: 'user-banner',
  path: `user/${person.id}/banner`,
  convert: {width: 1600, format: 'jpg', fit: 'max', rotate: 'exif'}
})

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_user_banner.jpg'
