export const MODULE_NAME = 'PasswordReset'
export const RESET_PASSWORD = `${MODULE_NAME}/RESET_PASSWORD`

export function resetPassword (email) {
  return {
    type: RESET_PASSWORD,
    graphql: {
      query: `mutation ($email: email) {
        resetPassword(email: $email) {
          success
        }
      }`,
      variables: {
        email
      }
    }
  }
}
