import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import gql from 'graphql-tag'
import {
  CLEAR_MODERATOR_SUGGESTIONS,
  FETCH_MODERATOR_SUGGESTIONS,
  ADD_MODERATOR,
  REMOVE_MODERATOR
} from 'store/constants'

export const MODULE_NAME = 'ModeratorsSettingsTab'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_MODERATOR_SUGGESTIONS:
      return payload.data.group.members.items.map(m => m.id)
    case CLEAR_MODERATOR_SUGGESTIONS:
      return []
    default:
      return state
  }
}

export function fetchModeratorSuggestions (id, autocomplete) {
  return {
    type: FETCH_MODERATOR_SUGGESTIONS,
    graphql: {
      query: gql`
        query ($id: ID, $autocomplete: String) {
          group (id: $id) {
            id
            members (first: 10, autocomplete: $autocomplete) {
              hasMore
              items {
                id
                name
                avatarUrl
              }
            }
          }
        }
      `,
      variables: {
        id, autocomplete
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function clearModeratorSuggestions () {
  return {
    type: CLEAR_MODERATOR_SUGGESTIONS
  }
}

export function addModerator (personId, groupId) {
  return {
    type: ADD_MODERATOR,
    graphql: {
      query: gql`
        mutation ($personId: ID, $groupId: ID) {
          addModerator(personId: $personId, groupId: $groupId) {
            id
            moderators (first: 100) {
              items {
                id
                name
                avatarUrl
              }
            }
          }
        }
      `,
      variables: { personId, groupId }
    },
    meta: {
      personId,
      groupId,
      optimistic: true
    }
  }
}

export function removeModerator (personId, groupId, isRemoveFromGroup) {
  return {
    type: REMOVE_MODERATOR,
    graphql: {
      query: gql`
        mutation ($personId: ID, $groupId: ID, $isRemoveFromGroup: Boolean) {
          removeModerator(personId: $personId, groupId: $groupId, isRemoveFromGroup: $isRemoveFromGroup) {
            id
            moderators (first: 100) {
              items {
                id
                name
                avatarUrl
              }
            }
          }
        }
      `,
      variables: { personId, groupId, isRemoveFromGroup }
    },
    meta: {
      personId,
      groupId,
      isRemoveFromGroup,
      optimistic: true
    }
  }
}

// expects props to be of the form {groupId}
export const getModerators = ormCreateSelector(
  orm,
  (state, props) => props.groupId,
  ({ Group }, id) => {
    const group = Group.safeGet({ id })
    if (!group) return []
    return group.moderators.toModelArray()
  }
)
