import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import gql from 'graphql-tag'
import presentPost from 'store/presenters/presentPost'
import PostFieldsFragment from 'graphql/PostFieldsFragment'
import { FETCH_MEMBER_POSTS } from '../MemberProfile.store'

const memberPostsQuery = gql`
  query MemberPosts (
    $afterTime: Date
    $beforeTime: Date
    $boundingBox: [PointInput]
    $filter: String
    $first: Int
    $groupSlugs: [String]
    $id: ID
    $offset: Int
    $context: String
    $order: String
    $search: String
    $sortBy: String
    $topic: ID
  ) {
    person (id: $id) {
      id
      posts(
        afterTime: $afterTime
        beforeTime: $beforeTime
        boundingBox: $boundingBox
        filter: $filter
        first: $first
        groupSlugs: $groupSlugs
        offset: $offset
        context: $context
        order: $order
        sortBy: $sortBy
        search: $search
        topic: $topic
      ) {
        hasMore
        total
        items {
          ...PostFieldsFragment
        }
      }
    }
  }
  ${PostFieldsFragment}
`

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
