import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const FETCH_PERSON = 'FETCH_PERSON'
export const FETCH_RECENT_ACTIVITY = 'FETCH_RECENT_ACTIVITY'
export const FETCH_MEMBER_POSTS = 'FETCH_MEMBER_POSTS'

const fetchPersonQuery =
`query PersonDetails ($id: ID, $order: String, $limit: Int) {
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
        slug
      }
    }
    votes (first: $limit, order: $order) {
      id
      post {
        id
        title
        details
        type
        creator {
          id
        }
        commenters {
          id,
          name,
          avatarUrl
        }
        commentersTotal
        communities {
          id
          name
        }
        createdAt
      }
      voter {
        id
      }
      createdAt
    }
  }
}`

export function fetchPerson (id, order = 'desc', limit = 20, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id, limit, order }
    }
  }
}

export function getRole (slug, memberships = []) {
  return memberships.find(m => m.community.slug === slug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

// Deliberately preserves object references
// Used to display interspersed posts and comments on 'Recent Activity'
export function indexActivityItems (comments, posts) {
  // TODO: support something other than descending order
  return comments.concat(posts)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt)
      const bDate = new Date(b.createdAt)
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0
    })
}

const defaultPerson = {
  name: '',
  avatarUrl: '',
  bannerUrl: ''
}

export const personSelector = createSelector(
  orm,
  state => state.orm,
  (_, props) => props.match.params,
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
        votes: person.votes.toModelArray().map(({ post }) => ({
          ...post.ref,
          creator: post.creator.ref,
          commenters: post.commenters.toRefArray(),
          communities: post.communities.toRefArray()
        }))
      }
      return {
        ...result,
        role: getRole(slug, result.memberships)
      }
    }
    return defaultPerson
  }
)
