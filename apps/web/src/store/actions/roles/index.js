import {
  ADD_GROUP_ROLE,
  ADD_ROLE_TO_MEMBER,
  FETCH_MEMBERS_FOR_GROUP_ROLE,
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

export function addRoleToMember ({ personId, groupId, groupRoleId }) {
  return {
    type: ADD_ROLE_TO_MEMBER,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID, $groupRoleId: ID) {
        addRoleToMember(personId: $personId, groupId: $groupId, groupRoleId: $groupRoleId) {
          id
          active
        }
      }`,
      variables: { personId, groupId, groupRoleId }
    },
    meta: {
      personId,
      groupId,
      groupRoleId,
      optimistic: true
    }
  }
}

export function removeRoleFromMember ({ personId, groupId, groupRoleId }) {
  return {
    type: REMOVE_ROLE_FROM_MEMBER,
    graphql: {
      query: `mutation ($personId: ID, $groupId: ID, $groupRoleId: ID) {
        removeRoleFromMember(personId: $personId, groupId: $groupId, groupRoleId: $groupRoleId) {
          success
          error
        }
      }`,
      variables: { personId, groupId, groupRoleId }
    },
    meta: {
      personId,
      groupId,
      groupRoleId,
      optimistic: true
    }
  }
}

export function fetchMembersForGroupRole ({ id, groupRoleId }) {
  return {
    type: FETCH_MEMBERS_FOR_GROUP_ROLE,
    graphql: {
      query: `query ($id: ID, $groupRoleId: ID) {
        group (id: $id) {
          id
          members (first: 50, groupRoleId: $groupRoleId) {
            hasMore
            items {
              id
              name
              avatarUrl
              groupRoles{
                id
                emoji
                name
                description
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
