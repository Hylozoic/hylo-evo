import communityFieldsFragment from 'graphql/fragments/communityFieldsFragment'

const publicCommunitiesQueryFragment = `
communities(
  isPublic: true,
  sortBy: $sortBy,
  boundingBox: $boundingBox,
  search: $search
) {
  items {
    ${communityFieldsFragment()}
  }
}`

export default publicCommunitiesQueryFragment
