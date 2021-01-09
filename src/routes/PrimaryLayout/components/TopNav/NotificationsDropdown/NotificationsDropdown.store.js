import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import {
  FETCH_NOTIFICATIONS,
  MARK_ACTIVITY_READ,
  MARK_ALL_ACTIVITIES_READ
} from 'store/constants'

export function fetchNotifications () {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `query (
        $first: Int = 20,
        $order: String = "desc",
        $resetCount: Boolean = true
      ) {
        notifications (first: $first, order: $order, resetCount: $resetCount) {
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
                communities {
                  id
                  slug
                }
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
      variables: { id }
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

export const getNotifications = ormCreateSelector(
  orm,
  (session) => {
    return session.Notification
      .all()
      .orderBy(m => Number(m.id), 'desc')
      .toModelArray()
  }
)
