import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

const publicPostsQueryFragment = `
posts(
  isPublic: true,
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  search: $search,
  filter: $filter,
  boundingBox: $boundingBox,
  groupSlugs: $groupSlugs,
  topic: $topic,
  order: "desc"
) {
  hasMore
  items {
    ${postFieldsFragment(false)}
  }
}`

export default publicPostsQueryFragment
