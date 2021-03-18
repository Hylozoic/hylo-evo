import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

const groupsQueryFragment = `
groups(
  isPublic: $isPublic,
  sortBy: $sortBy,
  boundingBox: $boundingBox,
  search: $search,
  parentSlugs: $parentSlugs
) {
  items {
    ${groupFieldsFragment(false)}
  }
}`

export default groupsQueryFragment
