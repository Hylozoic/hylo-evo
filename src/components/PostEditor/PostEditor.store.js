// import { createSelector } from 'reselect'
//
export const MODULE_NAME = 'PostEditor'

const CREATE_POST = `${MODULE_NAME}/CREATE_POST`

// title,
// details,
// communityIds,
// startsAt,
// endsAt,
// parentPostId
export function createPost (title, details, communityIds, postType) {
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
