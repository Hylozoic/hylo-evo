import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

// viewPosts shows all the aggregate posts from current group and any
// children the current user is a member of. We alias as posts so
// redux-orm sets up the relationship between group and posts correctly
const groupViewPostsQueryFragment = `
posts: viewPosts(
  afterTime: $afterTime,
  beforeTime: $beforeTime,
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
  isFulfilled: $isFulfilled,
  offset: $offset,
  order: $order,
  sortBy: $sortBy,
  search: $search,
  topic: $topic,
  topics: $topics
) {
  hasMore
  total
  items {
    ${postFieldsFragment(false)}
  }
}`

export default groupViewPostsQueryFragment
