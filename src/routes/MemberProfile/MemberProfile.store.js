import { createSelector } from 'redux-orm'

import { FETCH_PERSON } from 'store/constants'

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
    location
    memberships {
      id
      role
      hasModeratorRole
      community {
        id
        name
      }
    }
    membershipsTotal
    posts {
      id
      title
      details
      type
      creator {
        id
      }
    }
    postsTotal
  }
}`

export function fetchPerson (id, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    }
  }
}

// TODO: this sort of thing belongs in an i18n module
const messages = {
  invalid: "That doesn't seem to be a valid person ID."
}

export function getRole (slug, memberships = []) {
  return memberships.find(m => m.community.slug === slug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

export const personSelector = createSelector(
  orm,
  state => state.orm,
  (_, params) => params,
  (session, params) => {
    const { id, slug } = params
    if (session.Person.hasId(id)) {
      const person = session.Person.withId(id)
      let result = {
        ...person.ref,
        memberships: person.memberships.toModelArray().map(membership => ({
          ...membership.ref,
          community: membership.community.ref
        })),
        posts: person.postsCreated.toModelArray().map(post => ({
          ...post.ref,
          communities: post.communities.toRefArray()
        }))
      }
      return { ...result, role: getRole(slug, result.memberships) }
    }
    return defaultPerson
  }
)
