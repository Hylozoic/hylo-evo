export const MODULE_NAME = 'GroupSettings'
export const REGENERATE_ACCESS_CODE = `${MODULE_NAME}/REGENERATE_ACCESS_CODE`
export const FETCH_GROUP_SETTINGS = `${MODULE_NAME}/FETCH_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS = `${MODULE_NAME}/UPDATE_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS_PENDING = UPDATE_GROUP_SETTINGS + '_PENDING'
export const DELETE_GROUP = `${MODULE_NAME}/DELETE_GROUP`

export function orderFromSort (sortBy) {
  if (sortBy === 'name') return 'asc'
  return 'desc'
}

export function fetchGroupSettings (slug) {
  return {
    type: FETCH_GROUP_SETTINGS,
    graphql: {
      query: `query ($slug: String) {
        group (slug: $slug) {
          id
          accessibility
          avatarUrl
          bannerUrl
          description
          location
          invitePath
          name
          settings {
            allowGroupInvites
            publicMemberDirectory
          }
          slug
          visibility
          childGroups (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
          moderators (first: 100) {
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
          parentGroups (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
          pendingInvitations {
            hasMore
            items {
              id
              email
              createdAt
              lastSentAt
            }
          }
          questions {
            items {
              id
              text
            }
          }
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function updateGroupSettings (id, changes) {
  return {
    type: UPDATE_GROUP_SETTINGS,
    graphql: {
      query: `mutation ($id: ID, $changes: GroupInput) {
        updateGroupSettings(id: $id, changes: $changes) {
          id
        }
      }`,
      variables: {
        id, changes
      }
    },
    meta: {
      id,
      changes,
      optimistic: true
    }
  }
}

export function regenerateAccessCode (groupId) {
  return {
    type: REGENERATE_ACCESS_CODE,
    graphql: {
      query: `mutation ($groupId: ID) {
        regenerateAccessCode(groupId: $groupId) {
          id
          invitePath
        }
      }`,
      variables: {
        groupId
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function deleteGroup (id) {
  return {
    type: DELETE_GROUP,
    graphql: {
      query: `mutation ($id: ID) {
        deleteGroup(id: $id) {
          success
        }
      }`,
      variables: {
        id
      }
    },
    meta: {
      optimistic: true,
      id
    }
  }
}
