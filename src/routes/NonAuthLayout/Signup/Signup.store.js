import { get } from 'lodash/fp'

export const MODULE_NAME = 'Signup'
export const SIGNUP = `${MODULE_NAME}/REGISTER`
export const SEND_EMAIL_VERIFICATION = `${MODULE_NAME}/SEND_EMAIL_VERIFICATION`
export const VERIFY_EMAIL = `${MODULE_NAME}/VERIFY_EMAIL`
export const CHECK_REGISTRATION_STATUS = `${MODULE_NAME}/CHECK_REGISTRATION_STATUS`

export function sendEmailVerification (email) {
  return {
    type: SEND_EMAIL_VERIFICATION,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/send-email-verification',
        params: {
          email
        }
      }
    }
  }
}

export function verifyEmail (email, code, token) {
  return {
    type: VERIFY_EMAIL,
    graphql: {
      query: `mutation ($code: String, $email: String, $token: String) {
        verifyEmail(code: $code, email: $email, token: $token) {
          id
          active
          email
          emailValidated
          hasRegistered
          name
        }
      }`,
      variables: {
        code,
        email,
        token
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('verifyEmail'),
          modelName: 'Me'
        }
      ]
    }
  }
}

export function signup (name, password) {
  return {
    type: SIGNUP,
    graphql: {
      query: `mutation ($name: String, $password: String) {
        register(name: $name, password: $password) {
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
      }`,
      variables: {
        name,
        password
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('register'),
          modelName: 'Me'
        }
      ]
    }
  }
}

export function checkRegistrationStatus () {
  return {
    type: CHECK_REGISTRATION_STATUS,
    graphql: {
      query: `query MeQuery {
        me {
          id
          email
          emailValidated
          hasRegistered
          name
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
