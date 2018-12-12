import { FETCH_NOTIFICATIONS, MARK_ACTIVITY_READ, MARK_ALL_ACTIVITIES_READ } from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { push } from 'react-router-redux'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION,
  ACTION_ANNOUNCEMENT
} from 'store/models/Notification'
import {
  commentUrl,
  postUrl,
  communityUrl,
  communitySettingsUrl
} from 'util/navigation'

export function fetchNotifications () {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `{
        notifications (first: 20, order: "desc", resetCount: true) {
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
              contributionAmount
            }
          }
        }
      }`
    },
    meta: {
      extractModel: 'Notification',
      resetCount: true
    }
  }
}

export function markActivityRead (id) {
  return {
    type: MARK_ACTIVITY_READ,
    graphql: {
      query: `mutation ($id: ID) {
        markActivityRead(id: $id) {
          id
        }
      }`,
      variables: {id}
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function markAllActivitiesRead () {
  return {
    type: MARK_ALL_ACTIVITIES_READ,
    graphql: {
      query: `mutation {
        markAllActivitiesRead {
          success
        }
      }`
    },
    meta: {
      optimistic: true
    }
  }
}

export function urlForNotification ({ activity, activity: { action, post, comment, community } }) {
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

export function goToNotification (notification) {
  return push(urlForNotification(notification))
}

export const getNotifications = ormCreateSelector(
  orm,
  state => state.orm,
  (session) => {
    return session.Notification
    .all()
    .orderBy(m => Number(m.id), 'desc')
    .toModelArray()
  }
)
