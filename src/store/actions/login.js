import { get } from 'lodash/fp'
import { LOGIN } from 'store/constants'

export default function login (email, password) {
  return {
    type: LOGIN,
    graphql: {
      query: `
        mutation ($email: String, $password: String) {
          login(email: $email, password: $password) {
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
                postNotifications
                signupInProgress
                streamChildPosts
                streamViewMode
                streamSortBy
                streamPostType
              }
            }
            error
          }
        }
      `,
      variables: {
        email,
        password
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('login.me'),
          modelName: 'Me'
        }
      ]
    }
  }
}
