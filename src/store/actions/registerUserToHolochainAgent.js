import HolochainRegisterUserMutation from 'graphql/mutations/HolochainRegisterUserMutation.graphql'

export const REGISTER_USER_TO_HOLOCHAIN_AGENT = 'REGISTER_USER_TO_HOLOCHAIN_AGENT'

export default function registerUserToHolochainAgent ({ id, name, avatarUrl }) {
  return {
    type: REGISTER_USER_TO_HOLOCHAIN_AGENT,
    graphql: {
      query: HolochainRegisterUserMutation,
      variables: {
        id,
        name,
        avatarUrl
      }
    },
    meta: {
      holochainAPI: true
    }
  }
}
