import {
  FETCH_COMMUNITY_SETTINGS,
  UPDATE_COMMUNITY_SETTINGS,
  FIND_MODERATORS
} from 'store/constants'

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

export function findModerators (slug, autocomplete) {
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
