import { JOIN_PROJECT } from 'store/constants'

export default function (id) {
  return {
    type: JOIN_PROJECT,
    graphql: {
      query: `mutation ($id: ID) {
        joinProject (id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      id
    }
  }
}
