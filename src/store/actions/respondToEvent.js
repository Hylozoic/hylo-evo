import { RESPOND_TO_EVENT } from 'store/constants'

export default function respondToEvent (id, response) {
  return {
    type: RESPOND_TO_EVENT,
    graphql: {
      query: `mutation($id: ID, $response: String) {
        respondToEvent(id: $id, response: $response) {
          success
        }
      }`,
      variables: {id, response}
    },
    meta: {
      id,
      response,
      optimistic: true
    }
  }
}
