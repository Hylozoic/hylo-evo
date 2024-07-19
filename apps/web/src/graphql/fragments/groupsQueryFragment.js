import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

const groupsQueryFragment = `
groups(
  boundingBox: $boundingBox,
  context: $context,
  parentSlugs: $parentSlugs,
  search: $search,
  sortBy: $sortBy,
  visibility: $visibility
) {
  items {
    ${groupFieldsFragment(false)}
  }
}`

export default groupsQueryFragment
