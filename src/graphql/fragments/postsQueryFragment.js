import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

const postsQueryFragment = `
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
    ${postFieldsFragment(false)}
  }
}`

export default postsQueryFragment
