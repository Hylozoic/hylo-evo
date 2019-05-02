import { get } from 'lodash/fp'
import gql from 'graphql-tag'
import { FETCH_THREADS } from 'store/constants'

export const FetchThreadsQuery = gql`
  query ($first: Int, $offset: Int) {
    me {
      id
      messageThreads(sortBy: "updatedAt", order: "desc", first: $first, offset: $offset) {
        total
        hasMore
        items {
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
                name
              }
            }
          }
        }
      }
    }
  }
`

export default function (first = 10, offset = 0, holochainAPI = false) {
  return {
    type: FETCH_THREADS,
    graphql: {
      query: FetchThreadsQuery,
      variables: {
        first,
        offset
      }
    },
    meta: {
      holochainAPI,
      extractModel: 'Me',
      extractQueryResults: {
        getItems: get('payload.data.me.messageThreads')
      }
    }
  }
}
