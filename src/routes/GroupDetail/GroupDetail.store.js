import { CREATE_JOIN_REQUEST, FETCH_MY_JOIN_REQUESTS } from 'store/constants'
import MyPendingJoinRequestsQuery from 'graphql/queries/MyPendingJoinRequestsQuery'
import gql from 'graphql-tag'

export const MODULE_NAME = 'GroupDetail'

export const JOIN_GROUP = `${MODULE_NAME}/JOIN_GROUP`
export const JOIN_GROUP_PENDING = `${MODULE_NAME}/JOIN_GROUP_PENDING`

export function fetchJoinRequests (groupId) {
  return {
    type: FETCH_MY_JOIN_REQUESTS,
    graphql: {
      query: MyPendingJoinRequestsQuery
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

export function joinGroup (groupId) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: gql`
        mutation JoinGroupMutation($groupId: ID) {
          joinGroup(groupId: $groupId) {
            id
            role
            hasModeratorRole
            group {
              id
              name
              slug
            }
            person {
              id
            }
            settings {
              showJoinForm
            }
          }
        }
      `,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Membership',
      groupId,
      optimistic: true
    }
  }
}

export function createJoinRequest (groupId, questionAnswers) {
  return {
    type: CREATE_JOIN_REQUEST,
    graphql: {
      query: gql`
        mutation CreateJoinRequest($groupId: ID, $questionAnswers: [QuestionAnswerInput]) {
          createJoinRequest(groupId: $groupId, questionAnswers: $questionAnswers) {
            request {
              id
              user {
                id
              }
              group {
                id
              }
              createdAt
              updatedAt
              status
            }
          }
        }
      `,
      variables: { groupId, questionAnswers }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}
