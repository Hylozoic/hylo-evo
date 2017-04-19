import { FETCH_USER_SETTINGS, UPDATE_USER_SETTINGS } from 'store/constants'

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
      rootModelName: 'Person'
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
