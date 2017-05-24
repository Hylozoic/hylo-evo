import { FETCH_CURRENT_USER } from 'store/constants'

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
            lastViewedAt
            newPostCount
            hasModeratorRole
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
      extractModel: 'Me'
    }
  }
}
