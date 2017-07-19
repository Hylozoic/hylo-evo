import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get, includes, isEmpty } from 'lodash/fp'
import { makeGetQueryResults } from 'store/reducers/queryResults'

export const FETCH_MEMBERS = 'FETCH_MEMBERS'

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
      getRoot: get('network.members')
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
      getRoot: get('community.members')
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
  (session, results) => {
    if (isEmpty(results) || isEmpty(results.ids)) return []
    return session.Person.all()
    .filter(x => includes(x.id, results.ids))
    .orderBy(x => results.ids.indexOf(x.id))
    .toModelArray()
  }
)

export const getHasMoreMembers = createSelector(
  getMemberResults,
  get('hasMore')
)
