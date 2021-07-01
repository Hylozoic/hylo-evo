import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

// viewPosts shows all the aggregate posts from current group and any
// children the current user is a member of. We alias as posts so
// redux-orm sets up the relationship between group and posts correctly
const groupViewPostsQueryFragment = `
posts: viewPosts(
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
  isFuture: $isFuture,
  offset: $offset,
  order: "desc",
  sortBy: $sortBy,
  search: $search,
  topic: $topic
) {
  hasMore
  total
  items {
    ${postFieldsFragment(false)}
  }
}`

export default groupViewPostsQueryFragment
