import { createSelector } from 'redux-orm'

import orm from 'store/models'
import { FETCH_MEMBER_POSTS } from '../MemberProfile.store'

const memberPostsQuery =
`query MemberPosts ($id: ID, $order: String, $limit: Int) {
  person (id: $id) {
    id
    posts (first: $limit, order: $order) {
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
  }
}`

export function fetchMemberPosts (id, order = 'desc', limit = 20, query = memberPostsQuery) {
  return {
    type: FETCH_MEMBER_POSTS,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const memberPostsSelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      return person.posts.toModelArray().map(post => ({
        ...post.ref,
        creator: post.creator.ref,
        commenters: post.commenters.toRefArray(),
        communities: post.communities.toRefArray()
      }))
    }
    return null
  }
)
