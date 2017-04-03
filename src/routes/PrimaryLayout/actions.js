import {
  FETCH_CURRENT_USER,
  TOGGLE_COMMUNITIES_DRAWER
} from 'store/constants'

export function fetchCurrentUser () {
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
            person {
              id
            }
            community {
              id
              name
              slug
              avatarUrl
            }
          }
        }
      }`
    }
  }
}

export function toggleCommunitiesDrawer () {
  return {
    type: TOGGLE_COMMUNITIES_DRAWER
  }
}
