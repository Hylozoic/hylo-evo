import { attr, fk, Model } from 'redux-orm'
import { find, get } from 'lodash/fp'
import { t as translate } from 'i18next'
import { TextHelpers } from 'hylo-shared'
import {
  postCommentUrl,
  postUrl,
  groupUrl
} from 'util/navigation'

export const ACTION_ANNOUNCEMENT = 'announcement'
export const ACTION_APPROVED_JOIN_REQUEST = 'approvedJoinRequest'
export const ACTION_COMMENT_MENTION = 'commentMention'
export const ACTION_DONATION_TO = 'donation to'
export const ACTION_DONATION_FROM = 'donation from'
export const ACTION_EVENT_INVITATION = 'eventInvitation'
export const ACTION_GROUP_CHILD_GROUP_INVITE = 'groupChildGroupInvite'
export const ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED = 'groupChildGroupInviteAccepted'
export const ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST = 'groupParentGroupJoinRequest'
export const ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED = 'groupParentGroupJoinRequestAccepted'
export const ACTION_JOIN_REQUEST = 'joinRequest'
export const ACTION_MENTION = 'mention'
export const ACTION_NEW_COMMENT = 'newComment'
export const ACTION_TAG = 'tag'
export const ACTION_NEW_POST = 'newPost'

export function urlForNotification ({ activity: { action, post, comment, group, meta: { reasons }, otherGroup } }) {
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
    case ACTION_ANNOUNCEMENT:
      return postUrl(post.id, { groupSlug })
    case ACTION_APPROVED_JOIN_REQUEST:
      return groupUrl(groupSlug)
    case ACTION_EVENT_INVITATION:
      return postUrl(post.id, { groupSlug })
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return groupUrl(groupSlug, 'settings/relationships')
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
      return groupUrl(otherGroupSlug)
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return groupUrl(otherGroupSlug, 'settings/relationships')
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return groupUrl(groupSlug)
    case ACTION_JOIN_REQUEST:
      return groupUrl(groupSlug, 'settings/requests')
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      return postCommentUrl({ postId: post.id, commentId: comment.id, groupSlug })
    case ACTION_NEW_POST:
    case ACTION_MENTION: {
      let topicName
      if (post.type === 'chat') {
        // If the mention is in a chat room, go to the chat room
        const tagReason = find(r => r.startsWith('tag: '), reasons)
        topicName = tagReason.split(': ')[1]
      }
      return postUrl(post.id, { groupSlug, topicName })
    }
    case ACTION_TAG: {
      // Put this one first so clicking on a chat notification always goes to that chat room, even if there was also a mention in the same post
      const tagReason = find(r => r.startsWith('tag: '), reasons)
      const topicName = tagReason.split(': ')[1]
      return postUrl(post.id, { groupSlug, topicName })
    }
  }
}

const NOTIFICATION_TEXT_MAX = 76
export const truncateHTML = html => TextHelpers.presentHTMLToText(html, { truncate: NOTIFICATION_TEXT_MAX })

export function titleForNotification (notification, trans) {
  // XXX: Need the imported option for the electron notifications in SocketListener.store to work, but doesn't actually have the translations available
  // TODO: perhaps notification text and translations should happen on the server, or in the electron app itself. should move notification transltions to hylo-shared?
  const t = trans || translate

  const { activity: { action, actor, post, group, meta: { reasons } } } = notification

  const postSummary = post ? (post.title && post.title.length > 0 ? post.title : truncateHTML(post.details)) : null
  const name = actor.name

  switch (action) {
    case ACTION_NEW_COMMENT:
      return t('New comment on "<strong>{{postSummary}}</strong>"', { postSummary })
    case ACTION_TAG: {
      const tagReason = find(r => r.startsWith('tag: '), reasons)
      const tag = tagReason.split(': ')[1]
      return t('New post in <strong>{{name}}</strong>', { name: '#' + tag })
    }
    case ACTION_NEW_POST:
      return t('New post in <strong>{{name}}</strong>', { name: group.name })
    case ACTION_JOIN_REQUEST:
      return t('New Join Request')
    case ACTION_APPROVED_JOIN_REQUEST:
      return t('Join Request Approved')
    case ACTION_MENTION:
      return t('<strong>{{name}}</strong> mentioned you', { name })
    case ACTION_COMMENT_MENTION:
      return t('<strong>{{name}}</strong> mentioned you in a comment on <strong{{postSummary}}</strong>', { name, postSummary })
    case ACTION_ANNOUNCEMENT:
      return t('New announcement in <strong>{{groupName}}</strong>', { groupName: group.name })
    case ACTION_DONATION_TO:
      return t('<strong>You</strong> contributed to a project')
    case ACTION_DONATION_FROM:
      return t('<strong>{{name}}</strong> contributed to your project', { name })
    case ACTION_EVENT_INVITATION:
      return t('<strong>{{name}}</strong> invited you to an event', { name })
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return t('Your group has been invited')
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
      return t('New Group Joined')
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return t('Group Requesting to Join')
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return t('New Group Joined')
    default:
      return null
  }
}

export function bodyForNotification (notification, trans) {
  // XXX: Need the imported option for the electron notifications in SocketListener.store to work, but doesn't actually have the translations available
  // TODO: perhaps notification text and translations should happen on the server, or in the electron app itself
  const t = trans || translate

  const { activity: { action, actor, post, comment, group, otherGroup, contributionAmount } } = notification

  const postSummary = post ? (post.title && post.title.length > 0 ? post.title : truncateHTML(post.details)) : null
  const name = actor.name

  switch (action) {
    case ACTION_COMMENT_MENTION:
    case ACTION_NEW_COMMENT: {
      const text = truncateHTML(comment.text)
      return t('<strong>{{name}}</strong> wrote: "{{text}}"', { name, text })
    }
    case ACTION_TAG:
    case ACTION_NEW_POST:
    case ACTION_ANNOUNCEMENT:
    case ACTION_MENTION: {
      return t('<strong>{{name}}</strong> wrote: "{{text}}"', { name, text: postSummary })
    }
    case ACTION_JOIN_REQUEST:
      return t('<strong>{{name}}</strong> asked to join {{groupName}}', { name, groupName: group.name })
    case ACTION_APPROVED_JOIN_REQUEST:
      return t('<strong>{{name}}</strong> approved your request to join {{groupName}}', { name, groupName: group.name })
    case ACTION_DONATION_TO:
      return t('<strong>{{name}}</strong> contributed {{amount}} to "{{postSummary}}"', { name: 'You', amount: contributionAmount / 100, postSummary })
    case ACTION_DONATION_FROM:
      return t('<strong>{{name}}</strong> contributed {{amount}} to "{{postSummary}}""', { name, amount: contributionAmount / 100, postSummary })
    case ACTION_EVENT_INVITATION:
      return t('<strong>{{name}}</strong> invited you to: "{{postSummary}}"', { name, postSummary })
    case ACTION_GROUP_CHILD_GROUP_INVITE:
      return t('<strong>{{groupName}}</strong> has invited <strong>{{name}}</strong> to join it', { groupName: group.name, name: otherGroup.name })
    case ACTION_GROUP_CHILD_GROUP_INVITE_ACCEPTED:
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST_ACCEPTED:
      return t('<strong>{{groupName}}</strong> has joined <strong>{{otherGroupName}}</strong>', { groupName: group.name, otherGroupName: otherGroup.name })
    case ACTION_GROUP_PARENT_GROUP_JOIN_REQUEST:
      return t('<strong>{{groupName}}</strong> has requested to join <strong>{{otherGroupName}}</strong>', { groupName: group.name, otherGroupName: otherGroup.name })
    default:
      return null
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
