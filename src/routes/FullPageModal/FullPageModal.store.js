import {
  FETCH_USER_SETTINGS,
  UPDATE_USER_SETTINGS,
  LEAVE_COMMUNITY,
  SET_CONFIRM_BEFORE_CLOSE
} from 'store/constants'

const defaultState = {
  confirm: false
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_CONFIRM_BEFORE_CLOSE:
      return {
        ...state,
        confirm: payload
      }
    default:
      return state
  }
}

export function setConfirmBeforeClose (confirm) {
  return {
    type: SET_CONFIRM_BEFORE_CLOSE,
    payload: confirm
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
