import { VOTE_ON_POST } from 'store/constants'

export function voteOnPost (postId, didVote) {
  return {
    type: VOTE_ON_POST,
    graphql: {
      query: `mutation($postId: ID, $didVote: Boolean) {
        vote(postId: $postId, didVote: $didVote) {
          id
          votesTotal
        }
      }`,
      variables: {postId, didVote}
    },
    meta: {
      postId,
      didVote,
      optimistic: true
    }
  }
}
