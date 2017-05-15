import { FETCH_NOTIFICATIONS } from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

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

export const getNotifications = ormCreateSelector(
  orm,
  state => state.orm,
  (session) => {
    return session.Notification.all().toModelArray()
  }
)
