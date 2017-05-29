import {
  FETCH_USER_SETTINGS,
  UPDATE_USER_SETTINGS,
  LEAVE_COMMUNITY,
  SET_FULL_PAGE_MODAL_MODIFIED
} from 'store/constants'

const defaultState = false

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_FULL_PAGE_MODAL_MODIFIED:
      return payload
    default:
      return state
  }
}

export function setFullPageModalModified (modified) {
  return {
    type: SET_FULL_PAGE_MODAL_MODIFIED,
    payload: modified
  }
}

export function fetchUserSettings () {
  return {
    type: FETCH_USER_SETTINGS,
    graphql: {
      query: `{
        me {
          id
          name
          email
          avatarUrl
          bannerUrl
          bio
          twitterName
          linkedinUrl
          facebookUrl
          url
          location
          tagline
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
      extractModel: 'Me'
    }
  }
}

export function updateUserSettings (settings) {
  return {
    type: UPDATE_USER_SETTINGS,
    graphql: {
      query: `mutation ($settings: MeInput) {
        updateMe(changes: $settings) {
          id
          name
          email
          avatarUrl
          bannerUrl
          bio
          twitterName
          linkedinUrl
          facebookUrl
          url
          location
          tagline
        }
      }`,
      variables: {
        settings
      }
    }
  }
}

export function leaveCommunity (id) {
  return {
    type: LEAVE_COMMUNITY,
    graphql: {
      query: `mutation ($id: ID) {
        leaveCommunity(id: $id)
      }`,
      variables: {id}
    },
    meta: {
      id,
      optimistic: true
    }
  }
}
