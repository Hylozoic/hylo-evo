import {
  ADD_RESPONSIBILITY_TO_ROLE,
  ADD_GROUP_RESPONSIBILITY,
  DELETE_GROUP_RESPONSIBILITY,
  UPDATE_GROUP_RESPONSIBILITY,
  FETCH_RESPONSIBILITIES_FOR_GROUP,
  REMOVE_RESPONSIBILITY_FROM_ROLE,
  FETCH_RESPONSIBILITIES_FOR_GROUP_ROLE,
  FETCH_RESPONSIBILITIES_FOR_COMMON_ROLE
} from 'store/constants'

export function addGroupResponsibility ({ groupId, title, description }) {
  return {
    type: ADD_GROUP_RESPONSIBILITY,
    graphql: {
      query: `mutation ($groupId: ID, $title: String, $description: String) {
        addGroupResponsibility (groupId: $groupId, title: $title, description: $description) {
          id
          title
          description
          type
        }
      }`,
      variables: { groupId, title, description }
    }
  }
}

export function addResponsibilityToRole ({ groupId, groupRoleId, responsibilityId }) {
  // DRAFT
  return {
    type: ADD_RESPONSIBILITY_TO_ROLE,
    graphql: {
      query: `mutation ($groupId: ID, $groupRoleId: ID, $responsibilityId: ID) {
        addResponsibilityToRole (groupId: $groupId, groupRoleId: $groupRoleId, responsibilityId: $responsibilityId) {
          id
          title
          description
          type
          responsibilityId
        }
      }`,
      variables: { groupId, groupRoleId, responsibilityId }
    }
    // meta: {
    //   extractModel: 'GroupRole'
    //   // CONSIDER OPTIMISTIC UPDATE
    // }
  }
}

export function removeResponsibilityFromRole ({ groupId, groupRoleId, roleResponsibilityId }) {
  return {
    type: REMOVE_RESPONSIBILITY_FROM_ROLE,
    graphql: {
      query: `mutation ($groupId: ID, $groupRoleId: ID, $roleResponsibilityId: ID) {
        removeResponsibilityFromRole (groupId: $groupId, groupRoleId: $groupRoleId, roleResponsibilityId: $roleResponsibilityId) {
          success
        }
      }`,
      variables: { groupId, groupRoleId, roleResponsibilityId }
    }
  }
}

export function deleteGroupResponsibility ({ groupId, responsibilityId }) {
  return {
    type: DELETE_GROUP_RESPONSIBILITY,
    graphql: {
      query: `mutation ($groupId: ID, $responsibilityId: ID) {
        deleteGroupResponsibility (groupId: $groupId, responsibilityId: $responsibilityId) {
          success
        }
      }`,
      variables: { groupId, responsibilityId }
    }
  }
}

export function updateGroupResponsibility ({ groupId, responsibilityId, title, description }) {
  return {
    type: UPDATE_GROUP_RESPONSIBILITY,
    graphql: {
      query: `mutation updateGroupResponsibility ($groupId: ID, $responsibilityId: ID, $title: String, $description: String) {
        updateGroupResponsibility(groupId: $groupId, responsibilityId: $responsibilityId, title: $title, description: $description) {
          id
          title
          description
          type
        }
      }`,
      variables: { groupId, responsibilityId, title, description }
    }
  }
}

export function fetchResponsibilitiesForGroup ({ groupId }) {
  return {
    type: FETCH_RESPONSIBILITIES_FOR_GROUP,
    graphql: {
      query: `query fetchResponsibiltiesForGroup ($groupId: ID) {
        responsibilities (groupId: $groupId) {           
          id
          title
          type
          description
        }
      }`,
      variables: { groupId }
    },
    meta: {
      extractModel: 'Group'
    }
  }
}

export function fetchResponsibilitiesForGroupRole ({ roleId: groupRoleId }) {
  return {
    type: FETCH_RESPONSIBILITIES_FOR_GROUP_ROLE,
    graphql: {
      query: `query fetchResponsibilitiesForGroupRole ($groupRoleId: ID) {
        responsibilities (groupRoleId: $groupRoleId) {           
          id
          title
          type
          description
          responsibilityId
        }
      }`,
      variables: { groupRoleId }
    }
  }
}

export function fetchResponsibilitiesForCommonRole ({ roleId: commonRoleId }) {
  return {
    type: FETCH_RESPONSIBILITIES_FOR_COMMON_ROLE,
    graphql: {
      query: `query fetchResponsibilitiesForCommonRole ($commonRoleId: ID) {
        responsibilities (commonRoleId: $commonRoleId) {           
          id
          title
          type
          description
          responsibilityId
        }
      }`,
      variables: { commonRoleId }
    }
  }
}
