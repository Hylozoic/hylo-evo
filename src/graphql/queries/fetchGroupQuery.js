import groupFieldsFragment from '../fragments/groupFieldsFragment'

export default `query ($id: ID, $slug: String) {
  group(id: $id, slug: $slug) {
    ${groupFieldsFragment(true)}
  }
}`
