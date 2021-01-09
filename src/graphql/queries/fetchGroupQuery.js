import groupFieldsFragment from '../fragments/groupFieldsFragment'

export default `query ($id: ID) {
  group(id: $id) {
    ${groupFieldsFragment(true)}
  }
}`
