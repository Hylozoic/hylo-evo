import { VOTE_ON_POST } from 'store/constants'

export function voteOnPost (postId) {
  return {
    type: VOTE_ON_POST,
    graphql: {
      query: `mutation($postId: ID) {
        vote(postId: $postId) {
          id
          votesTotal
        }
      }`,
      variables: {postId}
    },
    meta: {
      postId,
      optimistic: true
    }
  }
}
