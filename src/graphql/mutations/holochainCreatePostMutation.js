import holochainPostFieldsFragment from 'graphql/fragments/holochainPostFieldsFragment'

export default
`mutation (
  $base: String,
  $type: String,
  $title: String,
  $details: String
) {
  createPost(data: {
    base: $base,
    type: $type,
    title: $title,
    details: $details
  }) {${holochainPostFieldsFragment}}
}`
