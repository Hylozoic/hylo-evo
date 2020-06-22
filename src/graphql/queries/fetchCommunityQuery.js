import communityFieldsFragment from '../fragments/communityFieldsFragment'

export default `query ($id: ID) {
  community(id: $id) {
    ${communityFieldsFragment(true)}
  }
}`
