import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import postsQueryFragment from '@graphql/fragments/postsQueryFragment'
import { FETCH_MEMBER_POSTS } from '../MemberProfile.store'

const memberPostsQuery =
`query MemberPosts (
  $activePostsOnly: Boolean,
  $afterTime: Date,
  $announcementsOnly: Boolean,
  $beforeTime: Date,
  $boundingBox: [PointInput],
  $collectionToFilterOut: ID,
  $context: String,
  $createdBy: [ID],
  $cursor: ID,
  $filter: String,
  $first: Int,
  $forCollection: ID,
  $groupSlugs: [String],
  $id: ID,
  $interactedWithBy: [ID],
  $isFulfilled: Boolean,
  $mentionsOf: [ID],
  $offset: Int,
  $order: String,
  $search: String,
  $sortBy: String,
  $topic: ID,
  $topics: [ID],
  $types: [String]
) {
  person (id: $id) {
    id
    ${postsQueryFragment}
  }
}`

export function fetchMemberPosts (id, first = 20, query = memberPostsQuery) {
  return {
    type: FETCH_MEMBER_POSTS,
    graphql: {
      query,
      variables: { id, first }
    },
    meta: { extractModel: 'Person' }
  }
}

export const getMemberPosts = ormCreateSelector(
  orm,
  (_, { routeParams }) => routeParams,
  ({ Person }, { personId }) => {
    if (!Person.idExists(personId)) return
    return Person.withId(personId).posts.toModelArray().map(post =>
      presentPost(post))
  }
)
