import { CREATE_JOIN_REQUEST, FETCH_MY_JOIN_REQUESTS } from 'store/constants'
import fetchMyJoinRequestsQuery from 'graphql/queries/fetchMyJoinRequestsQuery'

export const MODULE_NAME = 'GroupDetail'

export const JOIN_GROUP = `${MODULE_NAME}/JOIN_GROUP`
export const JOIN_GROUP_PENDING = `${MODULE_NAME}/JOIN_GROUP_PENDING`

export function fetchJoinRequests (groupId) {
  return {
    type: FETCH_MY_JOIN_REQUESTS,
    graphql: {
      query: fetchMyJoinRequestsQuery(true)
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
      query: `mutation ($groupId: ID) {
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
        }
      }`,
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
      query: `mutation ($groupId: ID, $questionAnswers: [QuestionAnswerInput]) {
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
      }`,
      variables: { groupId, questionAnswers }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}
