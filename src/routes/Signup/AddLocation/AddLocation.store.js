import { UPDATE_USER_SETTINGS } from 'store/constants'

export function updateUserSettings (changes) {
  console.log('updateUserSettings changes', changes)
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($changes: MeInput) {
        updateMe(changes: $changes) {
          id
        }
      }`,
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
