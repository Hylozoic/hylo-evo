import {
  FETCH_SAVED_SEARCHES,
  DELETE_SAVED_SEARCH,
  SAVE_SEARCH,
  LEAVE_COMMUNITY,
  UNLINK_ACCOUNT,
  VIEW_SAVED_SEARCH,
  CREATE_AFFILIATION,
  DELETE_AFFILIATION
} from 'store/constants'
import CreateSavedSearchMutation from 'graphql/mutations/CreateSavedSearchMutation.graphql'

export const MODULE_NAME = 'UserSettings'

export const UPDATE_USER_SETTINGS = `${MODULE_NAME}/UPDATE_USER_SETTINGS`
export const UPDATE_USER_SETTINGS_PENDING = UPDATE_USER_SETTINGS + '_PENDING'
export const UPDATE_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_MEMBERSHIP_SETTINGS`
export const UPDATE_MEMBERSHIP_SETTINGS_PENDING = UPDATE_MEMBERSHIP_SETTINGS + '_PENDING'
export const UPDATE_ALL_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_ALL_MEMBERSHIP_SETTINGS`
export const UPDATE_ALL_MEMBERSHIP_SETTINGS_PENDING = `${UPDATE_ALL_MEMBERSHIP_SETTINGS}_PENDING`
export const REGISTER_STRIPE_ACCOUNT = `${MODULE_NAME}/REGISTER_STRIPE_ACCOUNT`

const defaultState = {
  searches: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_SAVED_SEARCHES:
      return {
        ...state,
        searches: payload.data.savedSearches.items
      }
    case DELETE_SAVED_SEARCH:
      const deletedId = payload.data.deleteSavedSearch
      return {
        ...state,
        searches: state.searches.filter(s => s.id !== deletedId)
      }
    case VIEW_SAVED_SEARCH:
      const search = payload.search
      return {
        ...state,
        selectedSearch: search
      }
    default:
      return state
  }
}

export function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
          id
        }
      }`,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes
    }
  }
}

export function fetchSavedSearches (userId) {
  return {
    type: FETCH_SAVED_SEARCHES,
    graphql: {
      query: `query ($userId: ID) {
        savedSearches(userId: $userId) {
          total
          hasMore
          items {
            id
            name
            boundingBox
            createdAt
            context
            community {
              name
              slug
            }
            network {
              name
              slug
            }
            isActive
            searchText
            topics {
              id
              name
            }
            postTypes
          }
        }
      }`,
      variables: { userId }
    }
  }
}

export function deleteSearch (id) {
  return {
    type: DELETE_SAVED_SEARCH,
    graphql: {
      query: `mutation ($id: ID) {
        deleteSavedSearch(id: $id)
      }`,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function saveSearch ({ boundingBox, communitySlug, context, lastPostId, name, networkSlug, postTypes, searchText, topicIds, userId }) {
  return {
    type: SAVE_SEARCH,
    graphql: {
      query: CreateSavedSearchMutation,
      variables: { boundingBox, communitySlug, context, lastPostId, name, networkSlug, postTypes, searchText, topicIds, userId }
    },
    meta: {
      boundingBox, communitySlug, context, lastPostId, name, networkSlug, postTypes, searchText, topicIds, userId, optimistic: true
    }
  }
}

export function viewSavedSearch (search) {
  return {
    type: VIEW_SAVED_SEARCH,
    payload: { search }
  }
}

export function createAffiliation () {

}

export function deleteAffiliation (id) {
  return {
    type: DELETE_AFFILIATION,
    graphql: {
      query: `mutation ($id: ID) {
        deleteAffiliation(id: $id)
      }`,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function leaveCommunity (id) {
  return {
    type: LEAVE_COMMUNITY,
    graphql: {
      query: `mutation ($id: ID) {
        leaveCommunity(id: $id)
      }`,
      variables: { id }
    },
    meta: {
      id,
      optimistic: true
    }
  }
}

export function unlinkAccount (provider) {
  return {
    type: UNLINK_ACCOUNT,
    graphql: {
      query: `mutation ($provider: String) {
        unlinkAccount(provider: $provider) {
          success
        }
      }`,
      variables: { provider }
    }
  }
}

export function updateMembershipSettings (communityId, settings) {
  return {
    type: UPDATE_MEMBERSHIP_SETTINGS,
    graphql: {
      query: `mutation ($communityId: ID, $data: MembershipInput) {
        updateMembership(communityId: $communityId, data: $data) {
          id
        }
      }`,
      variables: {
        data: {
          settings
        },
        communityId: communityId
      }
    },
    meta: {
      communityId,
      settings,
      optimistic: true
    }
  }
}

export function updateAllMemberships (communityIds, settings) {
  const subqueries = communityIds.map(communityId => `
    alias${communityId}: updateMembership(communityId: ${communityId}, data: {settings: ${JSON.stringify(settings).replace(/"/g, '')}}) {
      id
    }
  `).join()
  const query = `mutation {
    ${subqueries}
  }`
  return {
    type: UPDATE_ALL_MEMBERSHIP_SETTINGS,
    graphql: {
      query
    },
    meta: {
      settings,
      optimistic: true
    }
  }
}

export function registerStripeAccount (authorizationCode) {
  return {
    type: REGISTER_STRIPE_ACCOUNT,
    graphql: {
      query: `mutation ($authorizationCode: String) {
        registerStripeAccount(authorizationCode: $authorizationCode) {
          success
        }
      }`,
      variables: { authorizationCode }
    },
    meta: {
      authorizationCode
    }
  }
}
