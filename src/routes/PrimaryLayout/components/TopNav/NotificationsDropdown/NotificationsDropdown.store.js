import { FETCH_NOTIFICATIONS } from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { push } from 'react-router-redux'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION
} from 'store/models/Notification'
import {
  commentUrl,
  postUrl,
  communityUrl,
  communitySettingsUrl
} from 'util/index'

export function fetchNotifications () {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `{
        me {
          name
          notifications (first: 10, order: "desc") {
            total
            hasMore
            items {
              id
              createdAt
              activity {
                id
                actor {
                  id
                  name
                  avatarUrl
                }
                comment {
                  id
                  text
                }
                post {
                  id
                  title
                }
                community {
                  id
                  name
                  slug
                }
                meta {
                  reasons
                }
                action
                unread
              }
            }
          }
        }
      }`
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

export function urlForNotification ({ activity: { action, post, comment, community } }) {
  switch (action) {
    case ACTION_NEW_COMMENT:
    case ACTION_COMMENT_MENTION:
      return commentUrl(post.id, comment.id)
    case ACTION_TAG:
    case ACTION_MENTION:
      return postUrl(post.id, comment.id)
    case ACTION_JOIN_REQUEST:
      return communitySettingsUrl(community.slug)
    case ACTION_APPROVED_JOIN_REQUEST:
      return communityUrl(community.slug)
  }
}

export function goToNotification (notification) {
  return push(urlForNotification(notification))
}

export const getNotifications = ormCreateSelector(
  orm,
  state => state.orm,
  (session) => {
    return session.Notification.all().toModelArray()
  }
)
