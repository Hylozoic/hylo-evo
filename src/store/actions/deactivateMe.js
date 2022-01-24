import gql from 'graphql-tag'
import { DEACTIVATE_ME } from '../constants'

export default function deactivateMe () {
  return {
    type: DEACTIVATE_ME,
    graphql: {
      query: gql`
        mutation DeactivateMeMutation{
          deactivateMe {
            success
          }
        }
      `
    }
  }
}
