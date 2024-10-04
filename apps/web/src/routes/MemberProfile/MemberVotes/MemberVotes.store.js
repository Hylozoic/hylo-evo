import { createSelector as ormCreateSelector } from 'redux-orm'
import { compact } from 'lodash/fp'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import postFieldsFragment from '@graphql/fragments/postFieldsFragment'
import { FETCH_MEMBER_VOTES } from '../MemberProfile.store'

export function fetchMemberVotes (id, order = 'desc', limit = 20, providedQuery) { // TODO REACTIONS: switch this to reactions
  const query = providedQuery ||
  `query MemberVotes ($id: ID, $order: String, $limit: Int) {
    person (id: $id) {
      id
      votes (first: $limit, order: $order) {
        items {
          id
          post {
            ${postFieldsFragment(false)}
          }
          voter {
            id
          }
          createdAt
        }
      }
    }
  }`
  return {
    type: FETCH_MEMBER_VOTES, // TODO REACTIONS: switch this to reactions
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: { extractModel: 'Person' }
  }
}

export const getMemberVotes = ormCreateSelector( // TODO REACTIONS: switch this to reactions
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
