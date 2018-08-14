import { VOTE_ON_POST } from 'store/constants'

export function voteOnPost (postId, isUpvote) {
  return {
    type: VOTE_ON_POST,
    graphql: {
      query: `mutation($postId: ID, $isUpvote: Boolean) {
        vote(postId: $postId, isUpvote: $isUpvote) {
          id
          votesTotal
        }
      }`,
      variables: {postId, isUpvote}
    },
    meta: {
      analytics: 'Voted on Post',
      postId,
      isUpvote,
      optimistic: true
    }
  }
}
