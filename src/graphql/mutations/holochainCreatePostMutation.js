import holochainPostFieldsFragment from 'graphql/fragments/holochainPostFieldsFragment'

export default
`mutation (
  $communitySlug: String,
  $type: String,
  $title: String,
  $details: String,
  $createdAt: String
) {
  createPost(data: {
    communitySlug: $communitySlug,
    type: $type,
    title: $title,
    details: $details,
    createdAt: $createdAt
  }) {${holochainPostFieldsFragment(false)}}
}`
