import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get, includes, isEmpty } from 'lodash/fp'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

export const FETCH_MEMBERS = 'FETCH_MEMBERS'

export const REMOVE_MEMBER = 'REMOVE_MEMBER'
export const REMOVE_MEMBER_PENDING = REMOVE_MEMBER + '_PENDING'

export const communityMembersQuery = `
query ($slug: String, $first: Int, $sortBy: String, $offset: Int, $search: String) {
  community (slug: $slug) {
    id
    name
    avatarUrl
    memberCount
    members (first: $first, sortBy: $sortBy, offset: $offset, search: $search) {
      items {
        id
        name
        avatarUrl
        location
        tagline
      }
      hasMore
    }
  }
}`

export const networkMembersQuery = `
query ($slug: String, $first: Int, $sortBy: String, $offset: Int, $search: String) {
  network (slug: $slug) {
    id
    name
    slug
    avatarUrl
    memberCount
    members (first: $first, sortBy: $sortBy, offset: $offset, search: $search) {
      items {
        id
        name
        avatarUrl
        location
        tagline
      }
      hasMore
    }
  }
}`

export function fetchNetworkMembers (slug, sortBy, offset, search) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: networkMembersQuery,
      variables: {slug, first: 20, offset, sortBy, search}
    },
    meta: {
      extractModel: 'Network',
      extractQueryResults: {
        getItems: get('payload.data.network.members')
      }
    }
  }
}

export function fetchCommunityMembers (slug, sortBy, offset, search) {
  return {
    type: FETCH_MEMBERS,
    graphql: {
      query: communityMembersQuery,
      variables: {slug, first: 20, offset, sortBy, search}
    },
    meta: {
      extractModel: 'Community',
      extractQueryResults: {
        getItems: get('payload.data.community.members')
      }
    }
  }
}

export function removeMember (personId, communityId) {
  return {
    type: REMOVE_MEMBER,
    graphql: {
      query: `mutation($personId: ID, $communityId: ID) {
        removeMember(personId: $personId, communityId: $communityId) {
          id
          memberCount
        }
      }`,
      variables: { personId, communityId }
    },
    meta: {
      communityId,
      personId
    }
  }
}

export function fetchMembers ({ subject, slug, sortBy, offset, search }) {
  return subject === 'network'
    ? fetchNetworkMembers(slug, sortBy, offset, search)
    : fetchCommunityMembers(slug, sortBy, offset, search)
}

export default function reducer (state = {}, action) {
  return state
}

const getMemberResults = makeGetQueryResults(FETCH_MEMBERS)

export const getMembers = ormCreateSelector(
  orm,
  state => state.orm,
  getMemberResults,
  getCommunityForCurrentRoute,
  (session, results, community) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []

    return session.Community.withId(community.id).members
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export const getHasMoreMembers = createSelector(
  getMemberResults,
  get('hasMore')
)
