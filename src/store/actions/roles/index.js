import {
  ADD_GROUP_ROLE,
  ADD_ROLE_TO_MEMBER,
  FETCH_MEMBERS_FOR_GROUP_ROLE,
  FETCH_MEMBERS_FOR_GROUP_COMMON_ROLE,
  REMOVE_ROLE_FROM_MEMBER,
  UPDATE_GROUP_ROLE
} from 'store/constants'

export function addGroupRole ({ groupId, color, name, description, emoji }) {
  return {
    type: ADD_GROUP_ROLE,
    graphql: {
      query: `mutation ($groupId: ID, $color: String, $name: String, $description: String, $emoji: String) {
        addGroupRole (groupId: $groupId, color: $color, name: $name, description: $description, emoji: $emoji) {
          id
          color
          name
          description
          emoji
          active
        }
      }`,
      variables: {
        groupId, color, name, description, emoji
      }
    },
    meta: {
      groupId,
      color,
      name,
      description,
      emoji,
      optimistic: true
    }
  }
}

export function updateGroupRole ({ active, groupId, groupRoleId, color, name, description, emoji }) {
  return {
    type: UPDATE_GROUP_ROLE,
    graphql: {
      query: `mutation ($groupRoleId: ID, $active: Boolean, $color: String, $name: String, $description: String, $emoji: String, $groupId: ID) {
        updateGroupRole (groupRoleId: $groupRoleId, active: $active, groupId: $groupId, color: $color, name: $name, description: $description, emoji: $emoji) {
          active
          id
          color
          name
          description
          emoji
          active
        }
      }`,
      variables: {
        active, groupRoleId, color, name, description, emoji, groupId
      }
    },
    meta: {
      optimistic: true
    }
  }
}

export function addRoleToMember ({ personId, groupId, roleId, isCommonRole = false }) {
  return {
    type: ADD_ROLE_TO_MEMBER,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID, $roleId: ID, $isCommonRole: Boolean) {
        addRoleToMember(personId: $personId, groupId: $groupId, roleId: $roleId, isCommonRole: $isCommonRole) {
          id
        }
      }`,
      variables: { personId, groupId, roleId, isCommonRole }
    },
    meta: {
      personId,
      groupId,
      roleId,
      isCommonRole,
      optimistic: true
    }
  }
}

export function removeRoleFromMember ({ personId, groupId, roleId, isCommonRole = false }) {
  return {
    type: REMOVE_ROLE_FROM_MEMBER,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID, $roleId: ID, $isCommonRole: Boolean) {
        removeRoleFromMember(personId: $personId, groupId: $groupId, roleId: $roleId, isCommonRole: $isCommonRole) {
          success
          error
        }
      }`,
      variables: { personId, groupId, roleId, isCommonRole }
    },
    meta: {
      personId,
      groupId,
      roleId,
      isCommonRole,
      optimistic: true
    }
  }
}

export function fetchMembersForGroupRole ({ id, roleId: groupRoleId }) {
  return {
    type: FETCH_MEMBERS_FOR_GROUP_ROLE,
    graphql: {
      query: `query fetchMembersForGroupRole ($id: ID, $groupRoleId: ID) {
        group (id: $id) {
          id
          members (first: 50, groupRoleId: $groupRoleId) {
            hasMore
            items {
              id
              name
              avatarUrl
              groupRoles{
                items {
                   name
                   emoji
                   active
                   groupId
                   responsibilities {
                     id
                     title
                     description
                   }
                 }
               }
            }
          }
        }
      }`,
      variables: {
        id, groupRoleId
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function fetchMembersForCommonRole ({ id, roleId: groupCommonRoleId }) {
  return {
    type: FETCH_MEMBERS_FOR_GROUP_COMMON_ROLE,
    graphql: {
      query: `query fetchMembersForCommonRole ($id: ID, $groupCommonRoleId: ID) {
        group (id: $id) {
          id
          members (first: 50, groupCommonRoleId: $groupCommonRoleId) {
            hasMore
            items {
              id
              name
              avatarUrl
              commonRoles {
                items {
                  id
                  name
                  description
                  emoji
                  responsibilities {
                    items {
                      id
                      title
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        id, groupCommonRoleId
      }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}
