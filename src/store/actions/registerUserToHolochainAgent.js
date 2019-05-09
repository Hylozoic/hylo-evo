import { REGISTER_USER_TO_HOLOCHAIN_AGENT } from 'store/constants'
import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'

export default function registerUserToHolochainAgent ({ id, name, avatarUrl }) {
  return {
    type: REGISTER_USER_TO_HOLOCHAIN_AGENT,
    apollo: {
      mutation: HolochainRegisterUserMutation,
      variables: {
        id,
        name,
        avatarUrl
      }
    }
  }
}
