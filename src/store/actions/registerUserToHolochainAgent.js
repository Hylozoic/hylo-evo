export const REGISTER_USER_TO_HOLOCHAIN_AGENT = 'REGISTER_USER_TO_HOLOCHAIN_AGENT'

export const query = `
mutation ($id: ID, $name: String, $avatarUrl: String) {
  registerUser(id: $id, name: $name, avatarUrl: $avatarUrl) {
    success
  }
}
`

export default function registerUserToHolochainAgent ({ id, name, avatarUrl }) {
  return {
    type: REGISTER_USER_TO_HOLOCHAIN_AGENT,
    graphql: {
      query,
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
