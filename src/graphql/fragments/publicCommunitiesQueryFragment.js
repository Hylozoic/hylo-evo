import communityFieldsFragment from 'graphql/fragments/communityFieldsFragment'

const publicCommunitiesQueryFragment = `
communities(
  isPublic: true,
  sortBy: $sortBy,
  boundingBox: $boundingBox,
  search: $search,
  networkSlugs: $networkSlugs
) {
  items {
    ${communityFieldsFragment(false)}
  }
}`

export default publicCommunitiesQueryFragment
