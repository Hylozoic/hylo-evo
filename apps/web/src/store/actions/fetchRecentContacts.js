import gql from 'graphql-tag'
import { FETCH_RECENT_CONTACTS } from 'store/constants'

export const RecentContactsQuery = gql`
  query RecentContactsQuery ($first: Int) {
    connections (first: $first) {
      items {
        id
        person {
          id
          name
          avatarUrl
          memberships (first: 1) {
            id
            group {
              id
              name
            }
          }
        }
        type
        updatedAt
      }
    }
  }
`

export function fetchRecentContacts (query = RecentContactsQuery, first = 20) {
  return {
    type: FETCH_RECENT_CONTACTS,
    graphql: {
      query,
      variables: { first }
    },
    meta: { extractModel: 'PersonConnection' }
  }
}

export default fetchRecentContacts
