import { CREATE_JOIN_REQUEST, FETCH_MY_JOIN_REQUESTS } from 'store/constants'
import fetchMyPendingJoinRequestsQuery from 'graphql/queries/fetchMyPendingJoinRequestsQuery'

export const MODULE_NAME = 'GroupDetail'

export const JOIN_GROUP = `${MODULE_NAME}/JOIN_GROUP`
export const JOIN_GROUP_PENDING = `${MODULE_NAME}/JOIN_GROUP_PENDING`

export function fetchJoinRequests (groupId) {
  return {
    type: FETCH_MY_JOIN_REQUESTS,
    graphql: {
      query: fetchMyPendingJoinRequestsQuery
    },
    meta: {
      extractModel: 'Me'
    }
  }
}

export function joinGroup (groupId, questionAnswers) {
  return {
    type: JOIN_GROUP,
    graphql: {
      query: `mutation ($groupId: ID, $questionAnswers: [QuestionAnswerInput]) {
        joinGroup(groupId: $groupId, questionAnswers: $questionAnswers) {
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
            agreementsAcceptedAt
            joinQuestionsAnsweredAt
            showJoinForm
          }
        }
      }`,
      variables: {
        groupId,
        questionAnswers
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
