import gql from 'graphql-tag'

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
      query: gql`
        query GroupSettings($slug: String) {
          group (slug: $slug) {
            id
            accessibility
            avatarUrl
            bannerUrl
            description
            location
            locationObject {
              id
              addressNumber
              addressStreet
              bbox {
                lat
                lng
              }
              center {
                lat
                lng
              }
              city
              country
              fullText
              locality
              neighborhood
              region
            }
            invitePath
            name
            settings {
              allowGroupInvites
              askGroupToGroupJoinQuestions
              askJoinQuestions
              publicMemberDirectory
              showSuggestedSkills
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
            groupToGroupJoinQuestions {
              items {
                id
                questionId
                text
              }
            }
            joinQuestions {
              items {
                id
                questionId
                text
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
                avatarUrl
                id
                name
              }
            }
            prerequisiteGroups {
              items {
                avatarUrl
                id
                name
                slug
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
            suggestedSkills {
              items {
                id
                name
              }
            }
          }
        }
      `,
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
  if (changes.prerequisiteGroups) {
    changes.prerequisiteGroupIds = changes.prerequisiteGroups.map(g => g.id)
    delete changes.prerequisiteGroups
  }

  return {
    type: UPDATE_GROUP_SETTINGS,
    graphql: {
      query: gql`
        mutation UpdateGroupSettings($id: ID, $changes: GroupInput) {
          updateGroupSettings(id: $id, changes: $changes) {
            id
            groupToGroupJoinQuestions {
              items {
                id
                questionId
                text
              }
            }
            joinQuestions {
              items {
                id
                questionId
                text
              }
            }
            prerequisiteGroups {
              items {
                id
                avatarUrl
                name
                slug
              }
            }
          }
        }
      `,
      variables: {
        id, changes
      }
    },
    meta: {
      id,
      changes,
      extractModel: 'Group',
      optimistic: true
    }
  }
}

export function regenerateAccessCode (groupId) {
  return {
    type: REGENERATE_ACCESS_CODE,
    graphql: {
      query: gql`
        mutation RegenerateAccessCode($groupId: ID) {
          regenerateAccessCode(groupId: $groupId) {
            id
            invitePath
          }
        }
      `,
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
      query: gql`
        mutation DeleteGroup($id: ID) {
          deleteGroup(id: $id) {
            success
          }
        }
      `,
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
