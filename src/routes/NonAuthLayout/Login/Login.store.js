import { get } from 'lodash/fp'
import authWithService from './authWithService'
import { LOGIN } from 'store/constants'

export function login (email, password) {
  return {
    type: LOGIN,
    graphql: {
      query: `mutation ($email: String, $password: String) {
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
              signupInProgress
              streamViewMode
              streamSortBy
              streamPostType
            }
          }
        }
      }`,
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

export function loginWithService (name) {
  return {
    type: LOGIN,
    payload: authWithService(name)
  }
}
