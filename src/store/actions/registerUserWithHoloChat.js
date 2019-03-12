const REGISTER_USER_WITH_HOLO_CHAT = 'REGISTER_USER_WITH_HOLO_CHAT'

export const query = `
mutation ($id: ID, $name: String, $avatarUrl: String) {
  registerUser(id: $id, name: $name, avatarUrl: $avatarUrl) {
    success
  }
}
`

export default function registerUserWithHoloChat ({ id, name, avatarUrl }) {
  return {
    type: REGISTER_USER_WITH_HOLO_CHAT,
    graphql: {
      query,
      variables: {
        id,
        name,
        avatarUrl
      }
    },
    meta: {
      holoChatAPI: true
    }
  }
}
