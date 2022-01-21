
import gql from 'graphql-tag'

export default gql`
  query MessageThreadMessagesQuery ($id: ID, $cursor: ID) {
    messageThread (id: $id) {
      id
      messages(first: 80, cursor: $cursor, order: "desc") {
        items {
          id
          text
          createdAt
          creator {
            id
            name
            avatarUrl
          }
        }
        total
        hasMore
      }
    }
  }
`
