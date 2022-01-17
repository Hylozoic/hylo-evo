import { DEACTIVATE_ME } from '../constants'

export default function deactivateMe () {
  return {
    type: DEACTIVATE_ME,
    graphql: {
      query: `mutation {
        deactivateMe {
          success
        }
      }`
    }
  }
}
