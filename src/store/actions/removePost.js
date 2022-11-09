import { REMOVE_POST } from 'store/constants'

export function removePost (postId, slug) {
  return {
    type: REMOVE_POST,
    graphql: {
      query: `mutation ($postId: ID, $slug: String) {
        removePost(postId: $postId, slug: $slug) {
          success
        }
      }`,
      variables: {
        postId,
        slug
      }
    },
    meta: {
      optimistic: true,
      postId,
      slug
    }
  }
}
