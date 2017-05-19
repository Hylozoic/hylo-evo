export const MODULE_NAME = 'PostEditor'

const CREATE_POST = `${MODULE_NAME}/CREATE_POST`
const UPDATE_POST = `${MODULE_NAME}/UPDATE_POST`

export function createPost (post) {
  const { title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: CREATE_POST,
    graphql: {
      query: `mutation ($title: String, $details: String, $communityIds: [String]) {
        createPost(data: {title: $title, details: $details, communityIds: $communityIds}) {
          id
          title
          details
        }
      }`,
      variables: {
        title,
        details,
        communityIds
      }
    }
  }
}

export function updatePost (post) {
  const { title, details, communities } = post
  const communityIds = communities.map(c => c.id)
  return {
    type: UPDATE_POST,
    graphql: {
      query: `mutation ($title: String, $details: String, $communityIds: [String]) {
        updatePost(data: {title: $title, details: $details, communityIds: $communityIds}) {
          id
          title
          details
        }
      }`,
      variables: {
        title,
        details,
        communityIds
      }
    }
  }
}
