import { get } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = 'JoinCommunity'
export const USE_INVITATION = `${MODULE_NAME}/USE_INVITATION`
export const CHECK_INVITATION = `${MODULE_NAME}/CHECK_INVITATION`

export function checkInvitation (inviteCodes) {
  const { invitationToken, accessCode } = inviteCodes
  return {
    type: CHECK_INVITATION,
    graphql: {
      query: `query ($invitationToken: String, $accessCode: String) {
        checkInvitation (invitationToken: $invitationToken, accessCode: $accessCode) {
          valid
        }
      }`,
      variables: {
        invitationToken,
        accessCode
      }
    }
  }
}

export function useInvitation (userId, inviteCodes = {}) {
  const { invitationToken, accessCode } = inviteCodes
  return {
    type: USE_INVITATION,
    graphql: {
      query: `mutation ($userId: ID, $invitationToken: String, $accessCode: String) {
        useInvitation (userId: $userId, invitationToken: $invitationToken, accessCode: $accessCode) {
          membership {
            id
            role
            community {
              id
              name
              slug
            }
          }
          error
        }
      }`,
      variables: {
        userId,
        invitationToken,
        accessCode
      }
    },
    meta: {
      extractModel: [
        {
          modelName: 'Membership',
          getRoot: get('useInvitation.membership')
        }
      ],
      analytics: AnalyticsEvents.COMMUNITY_INVITATION_ACCEPTED
    }
  }
}

export function getNewMembership (state) {
  return get(`${MODULE_NAME}.membership`, state)
}

export function getValidInvite (state) {
  return get(`${MODULE_NAME}.valid`, state)
}

export const defaultState = {}

export default function reducer (state = defaultState, action) {
  const { type, payload } = action
  switch (type) {
    case CHECK_INVITATION:
      return {...state, ...payload.data.checkInvitation}
    case USE_INVITATION:
      return {...state, ...payload.data.useInvitation}
  }
  return state
}
