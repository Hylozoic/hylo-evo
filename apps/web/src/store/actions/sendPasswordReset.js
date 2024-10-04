import { SEND_PASSWORD_RESET } from 'store/constants'

export default function sendPasswordReset (email) {
  return {
    type: SEND_PASSWORD_RESET,
    graphql: {
      query: `
        mutation SendPasswordReset ($email: String!) {
          sendPasswordReset(email: $email) {
            success
          }
        }
      `,
      variables: {
        email
      }
    }
  }
}
