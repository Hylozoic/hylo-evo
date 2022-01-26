import gql from 'graphql-tag'
import PostFieldsFragment from 'graphql/PostFieldsFragment'

// viewPosts shows all the aggregate posts from current group and any
// children the current user is a member of. We alias as posts so
// redux-orm sets up the relationship between group and posts correctly
export default gql`
  fragment GroupViewPostsQueryFragment on Group {
    posts: viewPosts(
      afterTime: $afterTime,
      beforeTime: $beforeTime,
      boundingBox: $boundingBox,
      filter: $filter,
      first: $first,
      offset: $offset,
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
