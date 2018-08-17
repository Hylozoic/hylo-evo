import { VOTE_ON_POST } from 'store/constants'
import { AnalyticsEvents } from 'hylo-utils/constants'

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
      postId,
      isUpvote,
      optimistic: true,
      analytics: AnalyticsEvents.VOTED_ON_POST
    }
  }
}
