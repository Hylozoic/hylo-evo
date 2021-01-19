import { attr, fk, Model } from 'redux-orm'
import { get } from 'lodash/fp'
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
  const communitySlug = get('slug', community) ||
    // 2020-06-03 - LEJ
    // Some notifications (i.e. new comment and comment mention)
    // didn't have a community available on the activity object,
    // so pulling from the post object for those cases.
    // Once all legacy notifications are purged, or migrated,
    // this line can be removed.
    get('0.slug', post.communities.toRefArray())

  switch (action) {
    case ACTION_TAG:
    case ACTION_MENTION:
    case ACTION_ANNOUNCEMENT:
      return postUrl(post.id, { communitySlug })
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      return commentUrl(post.id, comment.id, { communitySlug })
    case ACTION_JOIN_REQUEST:
      return communitySettingsUrl(community.slug)
    case ACTION_APPROVED_JOIN_REQUEST:
      return communityUrl(communitySlug)
  }
}

class Notification extends Model {
  toString () {
    return `Message: ${this.id}`
  }
}

export default Notification

Notification.modelName = 'Notification'

Notification.fields = {
  id: attr(),
  activity: fk('Activity'),
  createdAt: attr()
}
