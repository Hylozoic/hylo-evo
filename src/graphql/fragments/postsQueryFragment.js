import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

const postsQueryFragment = `
posts(
  activePostsOnly: $activePostsOnly,
  afterTime: $afterTime,
  beforeTime: $beforeTime,
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
  groupSlugs: $groupSlugs,
  isFulfilled: $isFulfilled,
  offset: $offset,
  context: $context,
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

export default postsQueryFragment
