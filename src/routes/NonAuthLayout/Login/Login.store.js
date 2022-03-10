import { get } from 'lodash/fp'
import authWithService from './authWithService'
import { CHECK_LOGIN, LOGIN, LOGOUT } from 'store/constants'

export function login (email, password) {
  return {
    type: LOGIN,
    graphql: {
      query: `mutation ($email: String, $password: String) {
        createSession(email: $email, password: $password) {
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
          getRoot: get('createSession.me'),
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

export function checkLogin () {
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

export function setLogin (signedIn) {
  return {
    type: CHECK_LOGIN,
    payload: {
      signedIn
    }
  }
}

export function logout () {
  return {
    type: LOGOUT,
    payload: {
      api: { path: '/noo/session', method: 'DELETE' }
    },
    meta: {
      then: () => {
        window.location.href = '/login'
      }
    }
  }
}
