import { FETCH_CURRENT_USER } from '../constants'

export default function fetchCurrentUser () {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{
        me {
          id
          name
          avatarUrl
          memberships {
            id
            community {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`
    },
    meta: {
      rootModelName: 'Person'
    }
  }
}
