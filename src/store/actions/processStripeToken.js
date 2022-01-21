import gql from 'graphql-tag'
import { PROCESS_STRIPE_TOKEN } from 'store/constants'

export default function (postId, token, amount) {
  return {
    type: PROCESS_STRIPE_TOKEN,
    graphql: {
      query: gql`
        mutation ($postId: ID, $token: String, $amount: Int) {
          processStripeToken (postId: $postId, token: $token, amount: $amount) {
            success
          }
        }
      `,
      variables: {
        postId,
        token,
        amount
      }
    },
    meta: {
      optimistic: true,
      postId,
      amount
    }
  }
}
