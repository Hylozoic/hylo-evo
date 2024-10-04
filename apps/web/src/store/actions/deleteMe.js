import { DELETE_ME } from '../constants'

export default function deleteMe () {
  return {
    type: DELETE_ME,
    graphql: {
      query: `mutation {
        deleteMe {
          success
        }
      }`
    }
  }
}
