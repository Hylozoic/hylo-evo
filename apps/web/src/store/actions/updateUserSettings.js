import { get } from 'lodash/fp'
import { UPDATE_USER_SETTINGS } from 'store/constants'

export default function updateUserSettings (changes) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `
        mutation ($changes: MeInput) {
          updateMe(changes: $changes) {
            id
            avatarUrl
            email
            emailValidated
            hasRegistered
            name
            settings {
              alreadySeenTour
              digestFrequency
              dmNotifications
              commentNotifications
              postNotifications
              signupInProgress
              streamChildPosts
              streamViewMode
              streamSortBy
              streamPostType
            }
          }
        }
      `,
      variables: {
        changes
      }
    },
    meta: {
      optimistic: true,
      changes,
      extractModel: [
        {
          getRoot: get('updateMe'),
          modelName: 'Me'
        }
      ]
    }
  }
}
