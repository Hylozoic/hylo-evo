import { createSelector } from 'redux-orm'
import orm from 'store/models'

export const FETCH_PERSON = 'FETCH_PERSON'
export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'
export const FETCH_MEMBER_POSTS = 'FETCH_MEMBER_POSTS'
export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'
export const FETCH_MEMBER_VOTES = 'FETCH_MEMBER_VOTES'

const fetchPersonQuery =
`query PersonDetails ($id: ID) {
  person (id: $id) {
    id
    name
    avatarUrl
    bannerUrl
    bio
    twitterName
    linkedinUrl
    facebookUrl
    url
    tagline
    location
    messageThreadId
    memberships {
      id
      role
      hasModeratorRole
      community {
        id
        name
        slug
      }
    }
    skills (first: 100) {
      total
      hasMore
      items {
        id
        name
      }
    }
  }
}`

export function fetchPerson (id, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Person' }
  }
}

export function getRole (slug, memberships = []) {
  return memberships.find(m => m.community.slug === slug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

export const personSelector = createSelector(
  orm,
  state => state.orm,
  (_, props) => props.match.params,
  ({ Person }, { personId, slug }) => {
    if (Person.hasId(personId)) {
      const person = Person.withId(personId)
      const memberships = person.memberships.toModelArray().map(membership => ({
        ...membership.ref,
        community: membership.community.ref
      }))

      return {
        ...person.ref,
        skills: person.skills && person.skills.toRefArray(),
        role: getRole(slug, memberships)
      }
    }
    return null
  }
)
