export const MODULE_NAME = 'PostEditor'

const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`

export function createPost (post) {
  const { type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($type: String, $title: String, $details: String, $communityIds: [String]) {
        createPost(data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
          communities {
            id
            name
            slug
          }
        }
      }`,
      variables: {
        type,
        title,
        details,
        communityIds
      }
    },
    meta: {extractModel: 'Post'}
  }
}

export function updatePost (post) {
  const { id, type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($id: ID, $type: String, $title: String, $details: String, $communityIds: [String]) {
        updatePost(id: $id, data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
          communities {
            id
            name
            slug
          }
        }
      }`,
      variables: {
        id,
        type,
        title,
        details,
        communityIds
      }
    },
    meta: {extractModel: 'Post'}
  }
}
