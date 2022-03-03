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

export function verifyEmail (email, code) {
  return {
    type: VERIFY_EMAIL,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/verify-email',
        params: {
          email,
          code
        }
      }
    }
  }
}

export function signup (email, name, password) {
  return {
    type: SIGNUP,
    payload: {
      api: {
        method: 'post',
        path: '/noo/user/register',
        params: {
          name,
          password
        }
      }
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
          hasRegistered
          name
        }
      }`
    },
    meta: {
      extractModel: [
        {
          getRoot: get('me'),
          modelName: 'Me',
          append: true
        }
      ]
    }
  }
}
