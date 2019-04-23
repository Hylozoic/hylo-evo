import holochainPostFieldsFragment from '../fragments/holochainPostFieldsFragment'

export default `query ($id: ID) {
  post(id: $id) {
    ${holochainPostFieldsFragment(true)}
  }
}`
