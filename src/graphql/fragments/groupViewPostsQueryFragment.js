import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

// TODO: change to showing aggregate tree of posts by doing
// posts: viewPosts(
const groupViewPostsQueryFragment = `
posts(
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
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
