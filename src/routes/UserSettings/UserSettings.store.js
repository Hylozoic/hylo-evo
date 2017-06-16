import {
  FETCH_USER_SETTINGS,
  LEAVE_COMMUNITY,
  UNLINK_ACCOUNT
} from 'store/constants'

export const MODULE_NAME = 'UserSettings'

export const UPDATE_USER_SETTINGS = `${MODULE_NAME}/UPDATE_USER_SETTINGS`
export const UPDATE_USER_SETTINGS_PENDING = UPDATE_USER_SETTINGS + '_PENDING'
export const UPDATE_MEMBERSHIP_SETTINGS = `${MODULE_NAME}/UPDATE_MEMBERSHIP_SETTINGS`
export const UPDATE_MEMBERSHIP_SETTINGS_PENDING = UPDATE_MEMBERSHIP_SETTINGS + '_PENDING'

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
          settings {
            digest_frequency
            dm_notifications
            comment_notifications
          }
          memberships {
            id
            settings {
              send_email
              send_push_notifications
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
        }
      }`,
      variables: {
        settings
      }
    },
    meta: {
      optimistic: true,
      settings
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

export function unlinkAccount (provider) {
  return {
    type: UNLINK_ACCOUNT,
    graphql: {
      query: `mutation ($provider: String) {
        unlinkAccount(provider: $provider) {
          success
        }
      }`,
      variables: {provider}
    }
  }
}

export function updateMembershipSettings (communityId, settings) {
  return {
    type: UPDATE_MEMBERSHIP_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $data: MembershipInput) {
        updateMembership(id: $id, data: $data) {
          id
        }
      }`,
      variables: {
        data: {
          settings
        },
        id: communityId
      }
    },
    meta: {
      communityId,
      settings,
      optimistic: true
    }
  }
}
