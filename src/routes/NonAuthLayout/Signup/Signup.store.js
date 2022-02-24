export const MODULE_NAME = 'Signup'
export const SIGNUP = `${MODULE_NAME}/REGISTER`
export const SEND_EMAIL_VERIFICATION = `${MODULE_NAME}/SEND_EMAIL_VERIFICATION`
export const VERIFY_EMAIL = `${MODULE_NAME}/VERIFY_EMAIL`

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
        path: '/noo/user',
        params: {
          name,
          email,
          email_validated: true,
          password,
          login: true
        }
      }
    }
  }
}
