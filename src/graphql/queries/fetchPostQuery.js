import getPostFieldsFragment from '../fragments/getPostFieldsFragment'

export default `query ($id: ID) {
  post(id: $id) {
    ${getPostFieldsFragment(true)}
  }
}`
