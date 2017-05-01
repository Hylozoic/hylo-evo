import {
  TOGGLE_COMMUNITIES_DRAWER,
  FETCH_CURRENT_USER
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
            lastViewedAt
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

export function toggleDrawer () {
  return {
    type: TOGGLE_COMMUNITIES_DRAWER
  }
}
