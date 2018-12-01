import getPostFieldsFragment from 'graphql/fragments/getPostFieldsFragment'

const postsQueryFragment = `
posts(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  search: $search,
  filter: $filter,
  topic: $topic,
  order: "desc"
) {
  hasMore
  items {
    ${getPostFieldsFragment(false)}
  }
}`

export default postsQueryFragment
