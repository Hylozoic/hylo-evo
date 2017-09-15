import { get } from 'lodash/fp'

export const MODULE_NAME = 'JoinCommunity'
export const USE_INVITATION = `${MODULE_NAME}/USE_INVITATION`
export const CHECK_INVITATION = `${MODULE_NAME}/CHECK_INVITATION`

export function checkInvitation (invitationToken) {
  return {
    type: CHECK_INVITATION,
    graphql: {
      query: `query ($invitationToken: String) {
        checkInvitation (invitationToken: $invitationToken) {
          valid
        }
      }`,
      variables: {
        invitationToken
      }
    }
  }
}

export function useInvitation (userId, invitationToken) {
  return {
    type: USE_INVITATION,
    graphql: {
      query: `mutation ($userId: ID, $invitationToken: String) {
        useInvitation (userId: $userId, invitationToken: $invitationToken) {
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
        invitationToken
      }
    },
    meta: {
      extractModel: {
        modelName: 'Community',
        getRoot: get('useInvitation.membership.community')
      }
    }
  }
}

export function getNewMembership (state) {
  return get(`${MODULE_NAME}.membership`, state)
}

export function getValidToken (state) {
  return get(`${MODULE_NAME}.valid`, state)
}

export default function reducer (state = {}, action) {
  const { type, payload } = action
  switch (type) {
    case CHECK_INVITATION:
      return {...state, ...payload.data.checkInvitation}
    case USE_INVITATION:
      return {...state, ...payload.data.useInvitation}
  }
  return state
}
