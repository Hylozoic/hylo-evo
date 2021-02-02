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

export const ALLOW_GROUP_INVITES = `${MODULE_NAME}/ALLOW_GROUP_INVITES`
export const DISALLOW_GROUP_INVITES = `${MODULE_NAME}/DISALLOW_GROUP_INVITES`

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type } = action
  if (error) return state

  switch (type) {
    default:
      return state
  }
}

export function createInvitations (groupId, emails, message) {
  return {
    type: CREATE_INVITATIONS,
    graphql: {
      query: `mutation ($groupId: ID, $data: InviteInput) {
        createInvitation(groupId: $groupId, data: $data) {
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
        groupId,
        data: {
          emails,
          message
        }
      }
    },
    meta: {
      groupId,
      emails,
      optimistic: true
    }
  }
}

export function reinviteAll (groupId) {
  return {
    type: REINVITE_ALL,
    graphql: {
      query: `mutation ($groupId: ID) {
        reinviteAll(groupId: $groupId) {
          success
        }
      }`,
      variables: {
        groupId
      }
    },
    meta: {
      groupId,
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

export function allowGroupInvites (groupId, data) {
  return {
    type: ALLOW_GROUP_INVITES,
    graphql: {
      query: `mutation ($groupId: ID, $data: Boolean) {
        allowGroupInvites(groupId: $groupId, data: $data) {
          id
        }
      }`,
      variables: {
        groupId,
        data
      }
    },
    meta: {
      groupId,
      optimistic: true
    }
  }
}

// expects props to be of the form {groupId}
export const getPendingInvites = ormCreateSelector(
  orm,
  (state, props) => props.groupId,
  ({ Invitation }, id) =>
    Invitation.filter(i => i.group === id)
      .orderBy(i => -new Date(i.createdAt))
      .toModelArray()
)

export function ormSessionReducer (session, { type, meta, payload }) {
  const { Group, Invitation } = session
  let group, invite

  switch (type) {
    case CREATE_INVITATIONS:
      payload.data.createInvitation.invitations.forEach(i =>
        Invitation.create({
          email: i.email,
          id: i.id,
          createdAt: new Date().toString(),
          group: meta.groupId
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
      group = Group.withId(meta.groupId)
      group.pendingInvitations.update({ resent: true, lastSentAt: new Date() })
      break
  }
}
