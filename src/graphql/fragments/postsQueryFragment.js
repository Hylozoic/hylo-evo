import postFieldsFragment from 'graphql/fragments/postFieldsFragment'

const postsQueryFragment = `
posts(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  search: $search,
  filter: $filter,
  topic: $topic,
  boundingBox: $boundingBox,
  order: "desc"
) {
  hasMore
  items {
    ${postFieldsFragment(false)}
  }
}`

export default postsQueryFragment
