export const MODULE_NAME = 'Groups'

// Constants
export const INVITE_CHILD_TO_JOIN_PARENT_GROUP = `${MODULE_NAME}/INVITE_CHILD_TO_JOIN_PARENT_GROUP`
export const REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP = `${MODULE_NAME}/REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP`

// TODO: how do we know whether we are getting a request back or a new relationship?
export function inviteGroupToJoinParent (parentId, childId) {
  return {
    type: INVITE_CHILD_TO_JOIN_PARENT_GROUP,
    graphql: {
      query: `mutation ($parentId: ID, $childId: ID) {
        inviteGroupToJoinParent(parentId: $parentId, childId: $childId) {
          success
        }
      }`,
      variables: { parentId, childId }
    },
    meta: {
      parentId,
      childId,
      optimistic: true
    }
  }
}

export function requestToAddGroupToParent (parentId, childId) {
  return {
    type: REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP,
    graphql: {
      query: `mutation ($parentId: ID, $childId: ID) {
        requestToAddGroupToParent(parentId: $parentId, childId: $childId) {
          success
        }
      }`,
      variables: { parentId, childId }
    },
    meta: {
      parentId,
      childId,
      optimistic: true
    }
  }
}

// Selectors
export const moduleSelector = (state) => state[MODULE_NAME]
