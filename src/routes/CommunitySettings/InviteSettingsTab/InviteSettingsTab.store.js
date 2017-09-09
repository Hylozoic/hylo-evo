import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'InviteSettingsTab'
export const CREATE_INVITATIONS = `${MODULE_NAME}/CREATE_INVITATIONS`
export const CREATE_INVITATIONS_PENDING = `${MODULE_NAME}/CREATE_INVITATIONS_PENDING`

export const EXPIRE_INVITATION = `${MODULE_NAME}/EXPIRE_INVITATION`
export const EXPIRE_INVITATION_PENDING = `${MODULE_NAME}/EXPIRE_INVITATION_PENDING`

export const RESEND_INVITATION = `${MODULE_NAME}/RESEND_INVITATION`
export const RESEND_INVITATION_PENDING = `${MODULE_NAME}/RESEND_INVITATION_PENDING`

export const REINVITE_ALL = `${MODULE_NAME}/REINVITE_ALL`
export const REINVITE_ALL_PENDING = `${MODULE_NAME}/REINVITE_ALL_PENDING`

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    default:
      return state
  }
}

export function createInvitations (communityId, emails, message) {
  return {
    type: CREATE_INVITATIONS,
    graphql: {
      query: `mutation ($communityId: ID, $data: InviteInput) {
        createInvitation(communityId: $communityId, data: $data) {
          invitations {
            id,
            email,
            created_at
            last_sent_at
          }
        }
      }`,
      variables: {
        communityId,
        data: {
          emails,
          message
        }
      }
    },
    meta: {
      communityId,
      emails,
      optimistic: true
    }
  }
}

export function reinviteAll (communityId) {
  return {
    type: REINVITE_ALL,
    graphql: {
      query: `mutation ($communityId: ID) {
        reinviteAll(communityId: $communityId) {
          success
        }
      }`,
      variables: {
        communityId
      }
    },
    meta: {
      communityId,
      optimistic: true
    }
  }
}

export function expireInvitation (invitationToken) {
  return {
    type: EXPIRE_INVITATION,
    graphql: {
      query: `mutation ($invitationToken: ID) {
        expireInvitation(invitationToken: $invitationToken) {
          success
        }
      }`,
      variables: {
        invitationToken
      }
    },
    meta: {
      invitationToken,
      optimistic: true
    }
  }
}

export function resendInvitation (invitationToken) {
  return {
    type: RESEND_INVITATION,
    graphql: {
      query: `mutation ($invitationToken: ID) {
        resendInvitation(invitationToken: $invitationToken) {
          success
        }
      }`,
      variables: {
        invitationToken
      }
    },
    meta: {
      invitationToken,
      optimistic: true
    }
  }
}

// expects props to be of the form {communityId}
export const getPendingInvites = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.communityId,
  ({ Community }, id) => {
    const community = Community.safeGet({id})
    if (!community || !community.pendingInvitations) return []
    community.pendingInvitations.orderBy(i => -new Date(i.created_at)).toModelArray()
    return community
    .pendingInvitations
    .orderBy(i => -new Date(i.created_at))
    .filter(invite => invite.id)
    .toModelArray()
  }
)
