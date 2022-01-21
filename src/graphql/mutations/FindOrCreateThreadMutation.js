import gql from 'graphql-tag'

export default gql`
  mutation FindOrCreateThreadMutation ($participantIds: [String]) {
    findOrCreateThread(data: {
      participantIds: $participantIds
    }) {
      id
      createdAt
      updatedAt
      participants {
        id
        name
        avatarUrl
      }
      messages {
        items {
          id
          text
          creator {
            id
            name
            avatarUrl
          }
          createdAt
        }
        total
        hasMore
      }
    }
  }
`
