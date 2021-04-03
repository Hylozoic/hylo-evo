import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

const postsQueryFragment = `
posts(
  boundingBox: $boundingBox,
  filter: $filter,
  first: $first,
  groupSlugs: $groupSlugs,
  offset: $offset,
  context: $context,
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

export default postsQueryFragment
