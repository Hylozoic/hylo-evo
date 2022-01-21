import gql from 'graphql-tag'
import PostFieldsFragment from '../fragments/PostFieldsFragment'

export default gql`
  query (
    $id: ID
    $withComments: Boolean = true
  ) {
    post(id: $id) {
      ...PostFieldsFragment
    }
  }

  ${PostFieldsFragment}
`
