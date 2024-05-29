import {
  CLEAR_STEWARD_SUGGESTIONS,
  FETCH_STEWARD_SUGGESTIONS
} from 'store/constants'

export const MODULE_NAME = 'RolesSettingsTab'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_STEWARD_SUGGESTIONS:
      return payload.data.group.members.items.map(m => m.id)
    case CLEAR_STEWARD_SUGGESTIONS:
      return []
    default:
      return state
  }
}

export function fetchStewardSuggestions (id, autocomplete) {
  return {
    type: FETCH_STEWARD_SUGGESTIONS,
    graphql: {
      query: `query ($id: ID, $autocomplete: String) {
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
      }`,
      variables: {
        id, autocomplete
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function clearStewardSuggestions () {
  return {
    type: CLEAR_STEWARD_SUGGESTIONS
  }
}
