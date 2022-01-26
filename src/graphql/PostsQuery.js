import gql from 'graphql-tag'
import PostFieldsFragment from 'graphql/PostFieldsFragment'

export default gql`
  query PostsQuery(
    $afterTime: Date
    $beforeTime: Date
    $boundingBox: [PointInput]
    $context: String
    $filter: String
    $first: Int
    $groupSlugs: [String]
    $offset: Int
    $order: String
    $search: String
    $sortBy: String
    $topic: ID
    $withComments: Boolean = false
  ) {
    posts(
      afterTime: $afterTime,
      beforeTime: $beforeTime,
      boundingBox: $boundingBox,
      filter: $filter,
      first: $first,
      groupSlugs: $groupSlugs,
      offset: $offset,
      context: $context,
      order: $order,
      sortBy: $sortBy,
      search: $search,
      topic: $topic
    ) {
      hasMore
      total
      items {
        ...PostFieldsFragment
      }
    }
  }
  ${PostFieldsFragment}
`
