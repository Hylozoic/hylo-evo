import { createSelector } from 'redux-orm'

import { FETCH_PERSON } from 'store/constants'
import orm from 'store/models'

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
    comments {
      id
      text
      creator {
        id
      }
      post {
        id
        title
      }
      createdAt
    }
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

export function getRole (slug, memberships = []) {
  return memberships.find(m => m.community.slug === slug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
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
        comments: person.comments.toModelArray().map(comment => ({
          ...comment.ref,
          creator: comment.creator.ref,
          post: comment.post.ref,
          slug
        })),
        memberships: person.memberships.toModelArray().map(membership => ({
          ...membership.ref,
          community: membership.community.ref
        })),
        posts: person.posts.toModelArray().map(post => ({
          ...post.ref,
          creator: post.creator.ref,
          commenters: post.commenters.toRefArray(),
          communities: post.communities.toRefArray()
        }))
      }
      return { ...result, role: getRole(slug, result.memberships) }
    }
    return defaultPerson
  }
)
