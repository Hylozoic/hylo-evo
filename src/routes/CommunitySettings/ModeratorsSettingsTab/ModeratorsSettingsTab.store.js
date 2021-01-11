import {
  CLEAR_MODERATOR_SUGGESTIONS,
  FETCH_MODERATOR_SUGGESTIONS,
  ADD_MODERATOR,
  REMOVE_MODERATOR
} from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'

export const MODULE_NAME = 'ModeratorsSettingsTab'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_MODERATOR_SUGGESTIONS:
      return payload.data.community.members.items.map(m => m.id)
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
      query: `query ($id: ID, $autocomplete: String) {
        community (id: $id) {
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
      }`,
      variables: {
        id, autocomplete
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

export function clearModeratorSuggestions () {
  return {
    type: CLEAR_MODERATOR_SUGGESTIONS
  }
}

export function addModerator (personId, communityId) {
  return {
    type: ADD_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $communityId: ID) {
        addModerator(personId: $personId, communityId: $communityId) {
          id
          moderators (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: { personId, communityId }
    },
    meta: {
      personId,
      communityId,
      optimistic: true
    }
  }
}

export function removeModerator (personId, communityId, isRemoveFromCommunity) {
  return {
    type: REMOVE_MODERATOR,
    graphql: {
      query: `mutation ($personId: ID, $communityId: ID, $isRemoveFromCommunity: Boolean) {
        removeModerator(personId: $personId, communityId: $communityId, isRemoveFromCommunity: $isRemoveFromCommunity) {
          id
          moderators (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: { personId, communityId, isRemoveFromCommunity }
    },
    meta: {
      personId,
      communityId,
      isRemoveFromCommunity,
      optimistic: true
    }
  }
}

// expects props to be of the form {communityId}
export const getModerators = ormCreateSelector(
  orm,
  (state, props) => props.communityId,
  ({ Community }, id) => {
    const community = Community.safeGet({ id })
    if (!community) return []
    return community.moderators.toModelArray()
  }
)
