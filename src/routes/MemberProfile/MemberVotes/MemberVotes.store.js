import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import gql from 'graphql-tag'
import { compact } from 'lodash/fp'
import presentPost from 'store/presenters/presentPost'
import PostFieldsFragment from 'graphql/PostFieldsFragment'
import { FETCH_MEMBER_VOTES } from '../MemberProfile.store'

export function fetchMemberVotes (id, order = 'desc', limit = 20, providedQuery) {
  const query = providedQuery || gql`
    query MemberVotes ($id: ID, $order: String, $limit: Int, $withComments: Boolean = false) {
      person (id: $id) {
        id
        votes (first: $limit, order: $order) {
          items {
            id
            post {
              ...PostFieldsFragment
            }
            voter {
              id
            }
            createdAt
          }
        }
      }
    }
    ${PostFieldsFragment}
  `

  return {
    type: FETCH_MEMBER_VOTES,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const getMemberVotes = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  ({ Vote }, { personId }) => {
    const votes = Vote.filter(v => String(v.voter) === String(personId)).toModelArray()
    if (!votes) return []
    return compact(votes.map(({ post }) => {
      if (!post) return
      return presentPost(post)
    }))
  }
)
