import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

const publicGroupsQueryFragment = `
groups(
  isPublic: true,
  sortBy: $sortBy,
  boundingBox: $boundingBox,
  search: $search,
  groupSlugs: $groupSlugs
) {
  items {
    ${groupFieldsFragment(false)}
  }
}`

export default publicGroupsQueryFragment
