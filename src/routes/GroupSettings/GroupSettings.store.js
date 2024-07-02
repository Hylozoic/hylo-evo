export const MODULE_NAME = 'GroupSettings'

export const ADD_POST_TO_COLLECTION = `${MODULE_NAME}/ADD_POST_TO_COLLECTION`
export const CREATE_COLLECTION = `${MODULE_NAME}/CREATE_COLLECTION`
export const DELETE_GROUP = `${MODULE_NAME}/DELETE_GROUP`
export const FETCH_COLLECTION_POSTS = `${MODULE_NAME}/FETCH_COLLECTION_POSTS`
export const FETCH_GROUP_SETTINGS = `${MODULE_NAME}/FETCH_GROUP_SETTINGS`
export const REGENERATE_ACCESS_CODE = `${MODULE_NAME}/REGENERATE_ACCESS_CODE`
export const REMOVE_POST_FROM_COLLECTION = `${MODULE_NAME}/REMOVE_POST_FROM_COLLECTION`
export const REORDER_POST_IN_COLLECTION = `${MODULE_NAME}/REORDER_POST_IN_COLLECTION`
export const UPDATE_GROUP_SETTINGS = `${MODULE_NAME}/UPDATE_GROUP_SETTINGS`
export const UPDATE_GROUP_SETTINGS_PENDING = UPDATE_GROUP_SETTINGS + '_PENDING'

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
          geoShape
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
          purpose
          settings {
            allowGroupInvites
            askGroupToGroupJoinQuestions
            askJoinQuestions
            hideExtensionData
            locationDisplayPrecision
            publicMemberDirectory
            showSuggestedSkills
          }
          type
          slug
          visibility
          agreements {
            items {
              id
              description
              order
              title
            }
          }
          childGroups (first: 100) {
            items {
              id
              name
              avatarUrl
            }
          }
          customViews {
            items {
              id
              activePostsOnly
              collectionId
              collection {
                id
                name
              }
              defaultSort
              defaultViewMode
              externalLink
              groupId
              isActive
              icon
              name
              order
              postTypes
              topics {
                id
                name
              }
              type
            }
          }
          groupRoles {
            items {
              active
              id
              emoji
              color
              name
              description
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
          stewards (first: 100) {
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
  if (changes.prerequisiteGroups) {
    changes.prerequisiteGroupIds = changes.prerequisiteGroups.map(g => g.id)
    delete changes.prerequisiteGroups
  }

  return {
    type: UPDATE_GROUP_SETTINGS,
    graphql: { // TODO: integrate custom views into this query
      query: `mutation ($id: ID, $changes: GroupInput) {
        updateGroupSettings(id: $id, changes: $changes) {
          id
          agreements {
            items {
              id
              description
              order
              title
            }
          }
          customViews {
            items {
              id
              activePostsOnly
              collectionId
              collection {
                id
              }
              defaultSort
              defaultViewMode
              externalLink
              groupId
              isActive
              icon
              name
              postTypes
              order
              topics {
                id
                name
              }
              type
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
          prerequisiteGroups {
            items {
              id
              avatarUrl
              geoShape
              name
              slug
            }
          }
        }
      }`,
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

export function fetchCollectionPosts (groupId) {
  return {
    type: FETCH_COLLECTION_POSTS,
    graphql: {
      query: `query ($id: ID) {
        group(id: $id) {
          id
          customViews {
            items {
              id
              collectionId
              collection {
                id
                linkedPosts {
                  items {
                    id
                    order
                    post {
                      id
                      title
                      creator {
                        id
                        name
                        avatarUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        id: groupId
      }
    },
    meta: {
      extractModel: 'Group',
      groupId
    }
  }
}

export function createCollection (collectionData) {
  return {
    type: CREATE_COLLECTION,
    graphql: {
      query: `mutation ($data: CollectionInput) {
        createCollection(data: $data) {
          id
        }
      }`,
      variables: {
        data: collectionData
      }
    },
    meta: {
      extractModel: 'Collection'
    }
  }
}

export function addPostToCollection (collectionId, postId) {
  return {
    type: ADD_POST_TO_COLLECTION,
    graphql: {
      query: `mutation ($collectionId: ID, $postId: ID) {
        addPostToCollection(collectionId: $collectionId, postId: $postId) {
          success
        }
      }`,
      variables: {
        collectionId,
        postId
      }
    }
  }
}

export function removePostFromCollection (collectionId, postId) {
  return {
    type: REMOVE_POST_FROM_COLLECTION,
    graphql: {
      query: `mutation ($collectionId: ID, $postId: ID) {
        removePostFromCollection(collectionId: $collectionId, postId: $postId) {
          success
        }
      }`,
      variables: {
        collectionId,
        postId
      }
    }
  }
}

export function reorderPostInCollection (collectionId, postId, newOrderIndex) {
  return {
    type: REORDER_POST_IN_COLLECTION,
    graphql: {
      query: `mutation ($collectionId: ID, $postId: ID, $newOrderIndex: Int) {
        reorderPostInCollection(collectionId: $collectionId, postId: $postId, newOrderIndex: $newOrderIndex) {
          success
        }
      }`,
      variables: {
        collectionId,
        postId,
        newOrderIndex
      }
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
