import { get } from 'lodash/fp'
import { CHECK_LOGIN } from 'store/constants'

export default function checkLogin () {
  return {
    type: CHECK_LOGIN,
    graphql: {
      query: `query MeQuery {
        me {
          id
          email
          emailValidated
          hasRegistered
          name
          settings {
            alreadySeenTour
            digestFrequency
            dmNotifications
            commentNotifications
            signupInProgress
            streamViewMode
            streamSortBy
            streamPostType
          }
        }
      }`
    },
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me'
        }
      ]
    }
  }
}
