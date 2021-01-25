import { createSelector as ormCreateSelector } from 'redux-orm'
import { createSelector } from 'reselect'
import orm from 'store/models'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'
import { get, includes, isEmpty } from 'lodash/fp'

export const MODULE_NAME = 'NetworkSettings'

// Constants
export const ADD_COMMUNITY_TO_NETWORK = `${MODULE_NAME}/ADD_COMMUNITY_TO_NETWORK`
export const ADD_COMMUNITY_TO_NETWORK_PENDING = `${ADD_COMMUNITY_TO_NETWORK}_PENDING`
export const ADD_NETWORK_MODERATOR_ROLE = `${MODULE_NAME}/ADD_NETWORK_MODERATOR_ROLE`
export const ADD_NETWORK_MODERATOR_ROLE_PENDING = `${ADD_NETWORK_MODERATOR_ROLE}_PENDING`
export const FETCH_COMMUNITIES = `${MODULE_NAME}/FETCH_COMMUNITIES`
export const FETCH_COMMUNITY_AUTOCOMPLETE = `${MODULE_NAME}/FETCH_COMMUNITY_AUTOCOMPLETE`
export const FETCH_MODERATOR_AUTOCOMPLETE = `${MODULE_NAME}/FETCH_MODERATOR_AUTOCOMPLETE`
export const FETCH_MODERATORS = `${MODULE_NAME}/FETCH_MODERATORS`
export const FETCH_NETWORK_SETTINGS = `${MODULE_NAME}/FETCH_NETWORK_SETTINGS`
export const REMOVE_COMMUNITY_FROM_NETWORK = `${MODULE_NAME}/REMOVE_COMMUNITY_FROM_NETWORK`
export const REMOVE_COMMUNITY_FROM_NETWORK_PENDING = `${REMOVE_COMMUNITY_FROM_NETWORK}_PENDING`
export const REMOVE_NETWORK_MODERATOR_ROLE = `${MODULE_NAME}/REMOVE_NETWORK_MODERATOR_ROLE`
export const REMOVE_NETWORK_MODERATOR_ROLE_PENDING = `${REMOVE_NETWORK_MODERATOR_ROLE}_PENDING`
export const SET_COMMUNITIES_PAGE = `${MODULE_NAME}/SET_COMMUNITIES_PAGE`
export const SET_MODERATORS_PAGE = `${MODULE_NAME}/SET_MODERATORS_PAGE`
export const UPDATE_NETWORK_SETTINGS = `${MODULE_NAME}/UPDATE_NETWORK_SETTINGS`
export const UPDATE_COMMUNITY_HIDDEN_SETTING = `${MODULE_NAME}/UPDATE_COMMUNITY_HIDDEN_SETTING`
export const UPDATE_COMMUNITY_HIDDEN_SETTING_PENDING = `${UPDATE_COMMUNITY_HIDDEN_SETTING}_PENDING`

export const AUTOCOMPLETE_SIZE = 20
export const PAGE_SIZE = 1000

const defaultState = {
  moderatorsPage: 0,
  communitiesPage: 0
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_MODERATOR_AUTOCOMPLETE:
      return {
        ...state,
        moderatorAutocomplete: payload.data.people.items
      }

    case FETCH_COMMUNITY_AUTOCOMPLETE:
      return {
        ...state,
        communityAutocomplete: payload.data.communities.items
      }

    case SET_MODERATORS_PAGE:
      return {
        ...state,
        moderatorsPage: payload
      }

    case SET_COMMUNITIES_PAGE:
      return {
        ...state,
        communitiesPage: payload
      }

    default:
      return state
  }
}

export function ormSessionReducer ({ Network, Community, Person }, { meta, type }) {
  if (type === REMOVE_COMMUNITY_FROM_NETWORK_PENDING) {
    if (Network.idExists(meta.networkId)) {
      const network = Network.withId(meta.networkId)
      network.update({
        communities: network.communities.toModelArray()
          .filter(c => c.id !== meta.communityId)
      })
    }
    if (Community.idExists(meta.communityId)) {
      const community = Community.withId(meta.communityId)
      community.update({ network: null })
    }
  }

  if (type === REMOVE_NETWORK_MODERATOR_ROLE_PENDING) {
    if (Network.idExists(meta.networkId)) {
      const network = Network.withId(meta.networkId)
      network.update({
        moderators: network.moderators.toModelArray()
          .filter(m => m.id !== meta.personId)
      })
    }
  }

  if (type === ADD_NETWORK_MODERATOR_ROLE) {
    if (Network.idExists(meta.networkId)) {
      const person = Person.withId(meta.personId)
      Network.withId(meta.networkId).updateAppending({ moderators: [person] })
    }
  }

  if (type === ADD_COMMUNITY_TO_NETWORK) {
    if (Network.idExists(meta.networkId) && Community.idExists(meta.communityId)) {
      const network = Network.withId(meta.networkId)
      const community = Community.withId(meta.communityId)
      network.updateAppending({ communities: [community] })
      community.update({ network: network })
    }
  }

  if (type === UPDATE_COMMUNITY_HIDDEN_SETTING_PENDING) {
    if (Community.idExists(meta.id)) {
      const community = Community.withId(meta.id)
      community.update({ hidden: meta.hidden })
    }
  }
}

// Action Creators

export function addCommunityToNetwork (communityId, networkId) {
  return {
    type: ADD_COMMUNITY_TO_NETWORK,
    graphql: {
      query: `mutation ($communityId: ID, $networkId: ID) {
        addCommunityToNetwork(communityId: $communityId, networkId: $networkId) {
          id
          communities {
            items {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        communityId,
        networkId
      }
    },
    meta: {
      extractModel: {
        modelName: 'Community',
        getRoot: get('addCommunityToNetwork.communities.items')
      },
      networkId,
      communityId
    }
  }
}

export function addNetworkModeratorRole (personId, networkId) {
  return {
    type: ADD_NETWORK_MODERATOR_ROLE,
    graphql: {
      query: `mutation ($personId: ID, $networkId: ID) {
        addNetworkModeratorRole(personId: $personId, networkId: $networkId) {
          id
          moderators {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        personId,
        networkId
      }
    },
    meta: {
      extractModel: {
        modelName: 'Person',
        getRoot: get('addNetworkModeratorRole.moderators.items')
      },
      networkId,
      personId
    }
  }
}

export function setModeratorsPage (page) {
  return {
    type: SET_MODERATORS_PAGE,
    payload: page
  }
}

export function setCommunitiesPage (page) {
  return {
    type: SET_COMMUNITIES_PAGE,
    payload: page
  }
}

// If we do an extractModel off this, we likely end up with a large set of
// unnecessary entities in the front end (especially if user is admin).
// Better to just house them in the module's store temporarily (see reducer).
export function autocompleteQuery (queryName, type) {
  return (autocomplete, first = AUTOCOMPLETE_SIZE, offset = 0) => ({
    type,
    graphql: {
      query: `query ($autocomplete: String, $first: Int, $offset: Int) {
        ${queryName} (autocomplete: $autocomplete, first: $first, offset: $offset) {
          total
          hasMore
          items {
            id
            name
            avatarUrl
          }
        }
      }`,
      variables: {
        autocomplete,
        first,
        offset
      }
    }
  })
}

export const fetchModeratorAutocomplete = autocompleteQuery(
  'people',
  FETCH_MODERATOR_AUTOCOMPLETE
)

export const fetchCommunityAutocomplete = autocompleteQuery(
  'communities',
  FETCH_COMMUNITY_AUTOCOMPLETE
)

export function fetchNetworkSettings (slug, pageSize = PAGE_SIZE) {
  return {
    type: FETCH_NETWORK_SETTINGS,
    graphql: {
      query: `query ($slug: String) {
        network (slug: $slug) {
          id
          slug
          name
          description
          avatarUrl
          bannerUrl
          createdAt
          communities (first: ${pageSize}, sortBy: "name")  {
            total
            hasMore
            items {
              id
              slug
              name
              avatarUrl
            }
          }
          moderators (first: ${pageSize}, sortBy: "name") {
            total
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
      extractModel: 'Network',
      page: 0
    }
  }
}

export function updateNetworkSettings (id, data) {
  return {
    type: UPDATE_NETWORK_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $data: NetworkInput) {
        updateNetwork(id: $id, data: $data) {
          id
        }
      }`,
      variables: {
        id, data
      }
    },
    meta: {
      id,
      data,
      optimistic: true
    }
  }
}

export function fetchModerators (slug, page) {
  const offset = page * PAGE_SIZE
  return {
    type: FETCH_MODERATORS,
    graphql: {
      query: `query ($slug: String, $offset: Int) {
        network (slug: $slug) {
          id
          moderators (first: ${PAGE_SIZE}, sortBy: "name", offset: $offset) {
            total
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
        slug,
        offset
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page
    }
  }
}

export function orderFromSort (sortBy) {
  if (sortBy === 'name') return 'asc'
  return 'desc'
}

export function fetchCommunities ({ slug, page, offset, sortBy = 'name', order, search, pageSize = PAGE_SIZE }) {
  offset = offset || page * pageSize
  order = order || orderFromSort(sortBy)
  return {
    type: FETCH_COMMUNITIES,
    graphql: {
      query: `query ($slug: String, $offset: Int, $sortBy: String, $order: String, $search: String) {
        network (slug: $slug) {
          id
          communities (first: ${pageSize}, sortBy: $sortBy, order: $order, offset: $offset, search: $search) {
            total
            hasMore
            items {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug,
        offset,
        sortBy,
        order,
        search
      }
    },
    meta: {
      extractModel: 'Network',
      // we use page for the queryResults reducer
      page
    }
  }
}

export function removeCommunityFromNetwork (communityId, networkId, pageSize = PAGE_SIZE) {
  return {
    type: REMOVE_COMMUNITY_FROM_NETWORK,
    graphql: {
      query: `mutation ($communityId: ID, $networkId: ID) {
        removeCommunityFromNetwork(communityId: $communityId, networkId: $networkId) {
          id
          communities (first: ${pageSize}) {
            items {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        communityId,
        networkId
      }
    },
    meta: {
      communityId,
      extractModel: 'Network',
      networkId
    }
  }
}

export function removeNetworkModeratorRole (personId, networkId) {
  return {
    type: REMOVE_NETWORK_MODERATOR_ROLE,
    graphql: {
      query: `mutation ($personId: ID, $networkId: ID) {
        removeNetworkModeratorRole(personId: $personId, networkId: $networkId) {
          id
          moderators {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        personId,
        networkId
      }
    },
    meta: {
      extractModel: 'Network',
      personId,
      networkId
    }
  }
}

export function updateCommunityHiddenSetting (id, hidden) {
  return {
    type: UPDATE_COMMUNITY_HIDDEN_SETTING,
    graphql: {
      query: `mutation ($id: ID, $hidden: Boolean) {
        updateCommunityHiddenSetting(id: $id, hidden: $hidden) {
          id
          hidden
        }
      }`,
      variables: {
        id, hidden
      }
    },
    meta: {
      extractModel: 'Community',
      id,
      hidden,
      optimistic: true
    }
  }
}

// Selectors
export const getNetwork = ormCreateSelector(
  orm,
  (state, { slug }) => slug,
  (session, slug) => {
    const network = session.Network.safeGet({ slug })
    if (network) {
      return {
        ...network.ref,
        communities: network.communities.orderBy(c => c.name).toModelArray(),
        moderators: network.moderators.orderBy(m => m.name).toModelArray()
      }
    }
    return null
  }
)

export const getModeratorResults = makeGetQueryResults(FETCH_MODERATORS)
export const getModeratorsTotal = createSelector(
  getModeratorResults,
  get('total')
)

export const getModerators = makeQueryResultsModelSelector(
  getModeratorResults,
  'Person'
)

export const getCommunitiesResults = makeGetQueryResults(FETCH_COMMUNITIES)
export const getCommunitiesTotal = createSelector(
  getCommunitiesResults,
  get('total')
)
export const getCommunitiesHasMore = createSelector(
  getCommunitiesResults,
  get('hasMore')
)

export const getCommunities = ormCreateSelector(
  orm,
  getCommunitiesResults,
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Community.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(x => results.ids.indexOf(x.id))
      .toModelArray()
  }
)

export const getCommunitiesPage = state => state[MODULE_NAME].communitiesPage
export const getModeratorsPage = state => state[MODULE_NAME].moderatorsPage
export const getCommunityAutocomplete = state => state[MODULE_NAME].communityAutocomplete
export const getModeratorAutocomplete = state => state[MODULE_NAME].moderatorAutocomplete
