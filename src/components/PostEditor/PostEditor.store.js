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
        }
      }`,
      variables: {
        type,
        title,
        details,
        communityIds
      }
    }
  }
}

export function updatePost (post) {
  const { type, title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($type: String, $title: String, $details: String, $communityIds: [String]) {
        updatePost(data: {type: $type, title: $title, details: $details, communityIds: $communityIds}) {
          id
          type
          title
          details
        }
      }`,
      variables: {
        type,
        title,
        details,
        communityIds
      }
    }
  }
}
