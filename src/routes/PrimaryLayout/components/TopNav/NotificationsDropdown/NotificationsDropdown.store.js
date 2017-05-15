import { FETCH_NOTIFICATIONS } from 'store/constants'

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
                meta {
                  reasons
                }
                action
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
