import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { get } from 'lodash/fp'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import orm from 'store/models'
import {
  FETCH_NOTIFICATIONS,
  MARK_ACTIVITY_READ,
  MARK_ALL_ACTIVITIES_READ
} from 'store/constants'

// Synced from ReactNative Nov '23
export function fetchNotifications (first = 20, offset = 0) {
  return {
    type: FETCH_NOTIFICATIONS,
    graphql: {
      query: `query NotificationsQuery (
        $first: Int = 20,
        $offset: Int = 0,
        $order: String = "desc",
        $resetCount: Boolean = true
      ) {
        notifications (first: $first, order: $order, offset: $offset, resetCount: $resetCount) {
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
                details
                groups {
                  id
                  slug
                }
              }
              group {
                id
                name
                slug
              }
              otherGroup {
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
      }`,
      variables: { first, offset }
    },
    meta: {
      extractModel: 'Notification',
      resetCount: true,
      extractQueryResults: {
        getItems: get('payload.data.notifications')
      }
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

// Synced from ReactNative Nov '23
const getNotificationsResults = makeGetQueryResults(FETCH_NOTIFICATIONS)

// Synced from ReactNative Nov '23
export const getHasMoreNotifications = createSelector(
  getNotificationsResults,
  get('hasMore')
)

export const getNotifications = ormCreateSelector(
  orm,
  (session) => {
    return session.Notification
      .all()
      .orderBy(m => Number(m.id), 'desc')
      .toModelArray()
  }
)
