import { get } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-shared'

export const MODULE_NAME = 'Signup'
export const REGISTER = `${MODULE_NAME}/REGISTER`
export const SEND_EMAIL_VERIFICATION = `${MODULE_NAME}/SEND_EMAIL_VERIFICATION`
export const VERIFY_EMAIL = `${MODULE_NAME}/VERIFY_EMAIL`
export const CHECK_REGISTRATION_STATUS = `${MODULE_NAME}/CHECK_REGISTRATION_STATUS`

export function sendEmailVerification (email) {
  return {
    type: SEND_EMAIL_VERIFICATION,
    graphql: {
      query: `
        mutation SendEmailVerification ($email: String!) {
          sendEmailVerification(email: $email) {
            success
            error
          }
        }
      `,
      variables: {
        email
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('sendEmailVerification.me'),
          modelName: 'Me'
        }
      ],
      analytics: {
        eventName: AnalyticsEvents.SIGNUP_EMAIL_VERIFICATION_SENT,
        email
      }
    }
  }
}

export function verifyEmail (email, code, token) {
  return {
    type: VERIFY_EMAIL,
    graphql: {
      query: `
        mutation ($email: String!, $code: String, $token: String) {
          verifyEmail(email: $email, code: $code, token: $token) {
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
                locale
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
        code,
        email,
        token
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('verifyEmail.me'),
          modelName: 'Me'
        }
      ],
      analytics: {
        eventName: AnalyticsEvents.SIGNUP_EMAIL_VERIFIED,
        email
      }
    }
  }
}

export function register (name, password) {
  return {
    type: REGISTER,
    graphql: {
      query: `
        mutation Register ($name: String!, $password: String!) {
          register(name: $name, password: $password) {
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
                locale
                streamChildPosts
                streamViewMode
                streamSortBy
                streamPostType
              }
            }
          }
        }
      `,
      variables: {
        name,
        password
      }
    },
    meta: {
      extractModel: [
        {
          getRoot: get('register.me'),
          modelName: 'Me'
        }
      ],
      analytics: {
        eventName: AnalyticsEvents.SIGNUP_REGISTERED
      }
    }
  }
}
