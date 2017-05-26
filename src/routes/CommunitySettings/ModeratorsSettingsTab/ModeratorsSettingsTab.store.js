import {
  CLEAR_MODERATOR_SUGGESTIONS,
  FETCH_COMMUNITY_SETTINGS,
  UPDATE_COMMUNITY_SETTINGS,
  FIND_MODERATORS
} from 'store/constants'

export const MODULE_NAME = 'CommunitySettings'

const defaultState = []

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FIND_MODERATORS:
      return payload.data.community.members.items.map(m => m.id)
    case CLEAR_MODERATOR_SUGGESTIONS:
      return []
    default:
      return state
  }
}

export function fetchCommunitySettings (slug) {
  return {
    type: FETCH_COMMUNITY_SETTINGS,
    graphql: {
      query: `query ($slug: String) {
        community (slug: $slug) {
          id
          name
          slug
          avatarUrl
          bannerUrl
          description
          location
          settings
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}

export function fetchModeratorSuggestions (slug, autocomplete) {
  return {
    type: FIND_MODERATORS,
    graphql: {
      query: `query ($slug: String, $autocomplete: String) {
        community (slug: $slug) {
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
        slug, autocomplete
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

export function updateCommunitySettings (id, changes) {
  return {
    type: UPDATE_COMMUNITY_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $changes: CommunityInput) {
        updateCommunitySettings(id: $id, changes: $changes) {
          id
        }
      }`,
      variables: {
        id, changes
      }
    }
  }
}
