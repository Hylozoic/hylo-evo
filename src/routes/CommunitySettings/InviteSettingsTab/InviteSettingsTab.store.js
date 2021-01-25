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

export const ALLOW_COMMUNITY_INVITES = `${MODULE_NAME}/ALLOW_COMMUNITY_INVITES`
export const DISALLOW_COMMUNITY_INVITES = `${MODULE_NAME}/DISALLOW_COMMUNITY_INVITES`

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
            createdAt,
            lastSentAt,
            error
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
        expireInvitation(invitationId: $invitationToken) {
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
        resendInvitation(invitationId: $invitationToken) {
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

export function allowCommunityInvites (communityId, data) {
  return {
    type: ALLOW_COMMUNITY_INVITES,
    graphql: {
      query: `mutation ($communityId: ID, $data: Boolean) {
        allowCommunityInvites(communityId: $communityId, data: $data) {
          id
        }
      }`,
      variables: {
        communityId,
        data
      }
    },
    meta: {
      communityId,
      optimistic: true
    }
  }
}

// expects props to be of the form {communityId}
export const getPendingInvites = ormCreateSelector(
  orm,
  (state, props) => props.communityId,
  ({ Invitation }, id) =>
    Invitation.filter(i => i.community === id)
      .orderBy(i => -new Date(i.createdAt))
      .toModelArray()
)

export function ormSessionReducer (session, { type, meta, payload }) {
  const { Community, Invitation } = session
  let community, invite

  switch (type) {
    case CREATE_INVITATIONS:
      payload.data.createInvitation.invitations.forEach(i =>
        Invitation.create({
          email: i.email,
          id: i.id,
          createdAt: new Date().toString(),
          community: meta.communityId
        }))
      break

    case RESEND_INVITATION_PENDING:
      invite = Invitation.withId(meta.invitationToken)
      if (!invite) break
      invite.update({ resent: true, lastSentAt: new Date() })
      break

    case EXPIRE_INVITATION_PENDING:
      invite = Invitation.withId(meta.invitationToken)
      invite.delete()
      break

    case REINVITE_ALL_PENDING:
      community = Community.withId(meta.communityId)
      community.pendingInvitations.update({ resent: true, lastSentAt: new Date() })
      break
  }
}
