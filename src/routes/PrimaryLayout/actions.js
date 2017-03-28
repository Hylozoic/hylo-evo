import { FETCH_CURRENT_USER } from 'store/constants'

export function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{
        me {
          id
          name
          avatarUrl
        }
      }`
    }
  }
}
