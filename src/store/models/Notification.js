import { attr, fk, Model } from 'redux-orm'
import { get } from 'lodash/fp'
import {
  commentUrl,
  postUrl,
  groupUrl
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
export const ACTION_GROUP_CHILD_GROUP_INVITE = 'groupChildGroupInvite'
export const ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED = 'groupChildGroupInviteAccepted'
export const ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST = 'groupParentGroupJoinRequest'
export const ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED = 'groupParentGroupJoinRequestAccepted'

export function urlForNotification ({ activity: { action, post, comment, group, otherGroup } }) {
  const groupSlug = get('slug', group) ||
    // 2020-06-03 - LEJ
    // Some notifications (i.e. new comment and comment mention)
    // didn't have a group available on the activity object,
    // so pulling from the post object for those cases.
    // Once all legacy notifications are purged, or migrated,
    // this line can be removed.
    get('0.slug', post.groups.toRefArray())

  const otherGroupSlug = get('slug', otherGroup)

  switch (action) {
    case ACTION_TAG:
    case ACTION_MENTION:
    case ACTION_ANNOUNCEMENT:
      return postUrl(post.id, { groupSlug })
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      return commentUrl(post.id, comment.id, { groupSlug })
    case ACTION_JOIN_REQUEST:
      return groupUrl(groupSlug, 'settings/requests')
    case ACTION_APPROVED_JOIN_REQUEST:
      return groupUrl(groupSlug)
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return groupUrl(groupSlug, 'settings/relationships')
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
      return groupUrl(otherGroupSlug)
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return groupUrl(otherGroupSlug, 'settings/relationships')
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return groupUrl(groupSlug)
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
