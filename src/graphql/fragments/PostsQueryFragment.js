import gql from 'graphql-tag'
import PostFieldsFragment from 'graphql/fragments/PostFieldsFragment'

export default gql`
  fragment PostsQueryFragment on Query {
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
