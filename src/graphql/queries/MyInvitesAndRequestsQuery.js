import gql from 'graphql-tag'

export default gql`
  query {
    me {
      id
      joinRequests {
        total
        hasMore
        items {
          id
          status
          createdAt
          questionAnswers {
            id
            question {
              id
              text
            }
            answer
          }
          group {
            id
            accessibility
            avatarUrl
            name
            slug
            visibility
          }
        }
      }
      groupInvitesPending {
        total
        hasMore
        items {
          id
          createdAt
          creator {
            id
            name
          }
          email
          group {
            id
            accessibility
            avatarUrl
            name
            slug
            visibility
          }
          token
        }
      }
    }
  }
`
