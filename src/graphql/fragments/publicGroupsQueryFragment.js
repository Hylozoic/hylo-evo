import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

const publicGroupsQueryFragment = `
groups(
  isPublic: true,
  sortBy: $sortBy,
  boundingBox: $boundingBox,
  search: $search,
  parentSlugs: $parentSlugs
) {
  items {
    ${groupFieldsFragment(false)}
  }
}`

export default publicGroupsQueryFragment
