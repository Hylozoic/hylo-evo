export const MODULE_NAME = 'CommunitySettings'
export const REGENERATE_ACCESS_CODE = `${MODULE_NAME}/REGENERATE_ACCESS_CODE`
export const FETCH_COMMUNITY_SETTINGS = `${MODULE_NAME}/FETCH_COMMUNITY_SETTINGS`
export const UPDATE_COMMUNITY_SETTINGS = `${MODULE_NAME}/UPDATE_COMMUNITY_SETTINGS`
export const UPDATE_COMMUNITY_SETTINGS_PENDING = UPDATE_COMMUNITY_SETTINGS + '_PENDING'

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
          invitePath
          pendingInvitations (first: 100) {
            hasMore
            items {
              id
              email
              created_at
              last_sent_at
            }
          }
          moderators (first: 100) {
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
        slug
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
    },
    meta: {
      id,
      changes,
      optimistic: true
    }
  }
}

export function regenerateAccessCode (communityId) {
  return {
    type: REGENERATE_ACCESS_CODE,
    graphql: {
      query: `mutation ($communityId: ID) {
        regenerateAccessCode(communityId: $communityId) {
          id
          invitePath
        }
      }`,
      variables: {
        communityId
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
