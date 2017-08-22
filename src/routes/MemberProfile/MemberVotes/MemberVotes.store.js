import { createSelector } from 'redux-orm'

import orm from 'store/models'
import { FETCH_MEMBER_VOTES } from '../MemberProfile.store'

const memberVotesQuery =
`query MemberVotes ($id: ID, $order: String, $limit: Int) {
  person (id: $id) {
    id
    votes (first: $limit, order: $order) {
      items {
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
  }
}`

export function fetchMemberVotes (id, order = 'desc', limit = 20, query = memberVotesQuery) {
  return {
    type: FETCH_MEMBER_VOTES,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const memberVotesSelector = createSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  (_, { slug }) => slug,
  (session, personId, slug) => {
    if (session.Person.hasId(personId)) {
      const person = session.Person.withId(personId)
      return person.votes.toModelArray().map(({ post }) => ({
        ...post.ref,
        creator: post.creator.ref,
        commenters: post.commenters.toRefArray(),
        communities: post.communities.toRefArray()
      }))
    }
    return null
  }
)
