import gql from 'graphql-tag'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'

export default gql`
  query {
    me {
      joinRequests(status: ${JOIN_REQUEST_STATUS.Pending}) {
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
            name
            avatarUrl
          }
        }
      }
    }
  }
`
