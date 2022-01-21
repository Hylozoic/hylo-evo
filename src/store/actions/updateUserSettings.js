import gql from 'graphql-tag'
import { UPDATE_USER_SETTINGS } from 'store/constants'

export default function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: gql`
        mutation ($changes: MeInput) {
          updateMe(changes: $changes) {
            id
          }
        }
      `,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes
    }
  }
}
