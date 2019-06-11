import { attr, fk, Model } from 'redux-orm'
import {
  commentUrl,
  postUrl,
  communityUrl,
  communitySettingsUrl
} from 'util/navigation'

export const ACTION_NEW_COMMENT = 'newComment'
export const ACTION_TAG = 'tag'
export const ACTION_JOIN_REQUEST = 'joinRequest'
export const ACTION_APPROVED_JOIN_REQUEST = 'approvedJoinRequest'
export const ACTION_MENTION = 'mention'
export const ACTION_COMMENT_MENTION = 'commentMention'
export const ACTION_ANNOUNCEMENT = 'announcement'
export const ACTION_DONATION_TO = 'donation to'
export const ACTION_DONATION_FROM = 'donation from'
export const ACTION_EVENT_INVITATION = 'eventInvitation'
export function urlForNotification ({ activity: { action, post, comment, community } }) {
  switch (action) {
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      return commentUrl(post.id, comment.id)
    case ACTION_TAG:
    case ACTION_MENTION:
      return postUrl(post.id)
    case ACTION_JOIN_REQUEST:
      return communitySettingsUrl(community.slug)
    case ACTION_APPROVED_JOIN_REQUEST:
      return communityUrl(community.slug)
    case ACTION_ANNOUNCEMENT:
      return postUrl(post.id)
  }
}

const Notification = Model.createClass({
  toString () {
    return `Message: ${this.id}`
  }
})

export default Notification

Notification.modelName = 'Notification'

Notification.fields = {
  id: attr(),
  activity: fk('Activity'),
  createdAt: attr()
}
