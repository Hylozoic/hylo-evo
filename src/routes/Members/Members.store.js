import { createSelector } from 'reselect'
import { get } from 'lodash/fp'
import { makeGetQueryResults, makeQueryResultsModelSelector } from 'store/reducers/queryResults'

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
        skills {
          hasMore
          items {
            id
            name
          }
        }
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
        skills {
          hasMore
          items {
            id
            name
          }
        }
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

export const getMembers = makeQueryResultsModelSelector(
  getMemberResults,
  'Person',
  person => ({
    ...person.ref,
    skills: person.skills.toModelArray()
  })
)

export const getHasMoreMembers = createSelector(
  getMemberResults,
  get('hasMore')
)

export function ormSessionReducer ({ Community }, { meta, type }) {
  if (type === REMOVE_MEMBER_PENDING) {
    const community = Community.withId(meta.communityId)
    const members = community.members.filter(m => m.id !== meta.personId)
    .toModelArray()
    community.update({members, memberCount: community.memberCount - 1})
  }
}
