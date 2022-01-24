import gql from 'graphql-tag'
import { JOIN_PROJECT } from 'store/constants'

export default function (id) {
  return {
    type: JOIN_PROJECT,
    graphql: {
      query: gql`
        mutation JoinProjectMutation($id: ID) {
          joinProject (id: $id) {
            success
          }
        }
      `,
      variables: {
        id
      }
    },
    meta: {
      id
    }
  }
}
