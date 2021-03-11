import groupFieldsFragment from '../fragments/groupFieldsFragment'
import groupTopicsQueryFragment from '../fragments/groupTopicsQueryFragment'

export default `query ($id: ID) {
  group(id: $id) {
    ${groupFieldsFragment(true)}
    ${groupTopicsQueryFragment}
  }
}`
