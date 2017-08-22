import { createSelector } from 'redux-orm'

import orm from 'store/models'

export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'

const memberCommentsQuery =
`query MemberComments ($id: ID, $order: String, $limit: Int) {
  person (id: $id) {
    id
    comments (first: $limit, order: $order) {
      items {
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
    }
  }
}`

export function fetchMemberComments (id, order = 'desc', limit = 20, query = memberCommentsQuery) {
  return {
    type: FETCH_MEMBER_COMMENTS,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const memberCommentsSelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      return person.comments.toModelArray().map(comment => ({
        ...comment.ref,
        creator: comment.creator.ref,
        post: comment.post.ref,
        slug
      }))
    }
    return null
  }
)
