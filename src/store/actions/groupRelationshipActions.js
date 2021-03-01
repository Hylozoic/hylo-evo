import { get } from 'lodash/fp'
import {
  ACCEPT_GROUP_RELATIONSHIP_INVITE,
  CANCEL_GROUP_RELATIONSHIP_INVITE,
  DELETE_GROUP_RELATIONSHIP,
  INVITE_CHILD_TO_JOIN_PARENT_GROUP,
  REJECT_GROUP_RELATIONSHIP_INVITE,
  REQUEST_FOR_CHILD_TO_JOIN_PARENT_GROUP
} from 'store/constants'

export function acceptGroupRelationshipInvite (groupRelationshipInviteId) {
  return {
    type: ACCEPT_GROUP_RELATIONSHIP_INVITE,
    graphql: {
      query: `mutation acceptGroupRelationshipInvite ($groupRelationshipInviteId: ID) {
        acceptGroupRelationshipInvite(groupRelationshipInviteId: $groupRelationshipInviteId) {
          success
          groupRelationship {
            id
            childGroup {
              id
            }
            parentGroup {
              id
            }
          }
        }
      }`,
      variables: {
        groupRelationshipInviteId
      }
    },
    meta: {
      id: groupRelationshipInviteId,
      extractModel: {
        getRoot: get('acceptGroupRelationshipInvite.groupRelationship'),
        modelName: 'GroupRelationship',
        append: true
      }
    }
  }
}

export function cancelGroupRelationshipInvite (groupRelationshipInviteId) {
  return {
    type: CANCEL_GROUP_RELATIONSHIP_INVITE,
    graphql: {
      query: `mutation cancelGroupRelationshipInvite ($groupRelationshipInviteId: ID) {
        cancelGroupRelationshipInvite(groupRelationshipInviteId: $groupRelationshipInviteId) {
          success
        }
      }`,
      variables: {
        groupRelationshipInviteId
      }
    },
    meta: {
      id: groupRelationshipInviteId
    }
  }
}

export function rejectGroupRelationshipInvite (groupRelationshipInviteId) {
  return {
    type: REJECT_GROUP_RELATIONSHIP_INVITE,
    graphql: {
      query: `mutation rejectGroupRelationshipInvite ($groupRelationshipInviteId: ID) {
        rejectGroupRelationshipInvite(groupRelationshipInviteId: $groupRelationshipInviteId) {
          success
        }
      }`,
      variables: {
        groupRelationshipInviteId
      }
    },
    meta: {
      id: groupRelationshipInviteId
    }
  }
}

export function deleteGroupRelationship (parentId, childId) {
  return {
    type: DELETE_GROUP_RELATIONSHIP,
    graphql: {
      query: `mutation deleteGroupRelationship ($parentId: ID, $childId: ID) {
        deleteGroupRelationship(parentId: $parentId, childId: $childId) {
          success
        }
      }`,
      variables: {
        parentId,
        childId
      }
    },
    meta: {
      parentId,
      childId
    }
  }
}

export function inviteGroupToJoinParent (parentId, childId) {
  return {
    type: INVITE_CHILD_TO_JOIN_PARENT_GROUP,
    graphql: {
      query: `mutation ($parentId: ID, $childId: ID) {
        inviteGroupToJoinParent(parentId: $parentId, childId: $childId) {
          success
          groupRelationship {
            id
            childGroup {
              id
            }
            parentGroup {
              id
            }
          }
          groupRelationshipInvite {
            id
            fromGroup {
              id
            }
            toGroup {
              id
            }
            type
            status
            createdBy {
              id
            }
          }
        }
      }`,
      variables: { parentId, childId }
    },
    meta: {
      parentId,
      childId,
      extractModel: [
        {
          getRoot: get('inviteGroupToJoinParent.groupRelationship'),
          modelName: 'GroupRelationship',
          append: true
        },
        {
          getRoot: get('inviteGroupToJoinParent.groupRelationshipInvite'),
          modelName: 'GroupRelationshipInvite',
          append: true
        }
      ]
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
          groupRelationship {
            id
            childGroup {
              id
            }
            parentGroup {
              id
            }
          }
          groupRelationshipInvite {
            id
            fromGroup {
              id
            }
            toGroup {
              id
            }
            type
            status
            createdBy {
              id
            }
          }
        }
      }`,
      variables: { parentId, childId }
    },
    meta: {
      parentId,
      childId,
      extractModel: [
        {
          getRoot: get('requestToAddGroupToParent.groupRelationship'),
          modelName: 'GroupRelationship',
          append: true
        },
        {
          getRoot: get('requestToAddGroupToParent.groupRelationshipInvite'),
          modelName: 'GroupRelationshipInvite',
          append: true
        }
      ]
    }
  }
}
