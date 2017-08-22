import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'InviteSettingsTab'
export const CREATE_INVITATIONS = `${MODULE_NAME}/CREATE_INVITATIONS`
export const FETCH_PENDING_INVITES = `${MODULE_NAME}/FETCH_PENDING_INVITES`

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
          success
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

// expects props to be of the form {communityId}
export const getPendingInvites = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.communityId,
  ({ Community }, id) => {
    const community = Community.safeGet({id})
    if (!community || !community.pendingInvitations) return []
    return community.pendingInvitations.items
  }
)
