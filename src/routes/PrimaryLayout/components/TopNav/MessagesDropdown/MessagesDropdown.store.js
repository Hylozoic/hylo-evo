import { FETCH_THREADS } from 'store/constants'

export function fetchThreads () {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: `{
        me {
          id
          messageThreads(first: 10, sortBy: "updatedAt", order: "desc") {
            id
            unreadCount
            lastReadAt
            createdAt
            updatedAt
            participants {
              id
              name
              avatarUrl
            }
            messages(first: 1, order: "desc") {
              items {
                id
                createdAt
                text
                creator {
                  id
                }
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
