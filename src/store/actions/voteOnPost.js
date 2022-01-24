import gql from 'graphql-tag'
import { AnalyticsEvents } from 'hylo-utils/constants'
import { VOTE_ON_POST } from 'store/constants'

export default function voteOnPost (postId, isUpvote) {
  return {
    type: VOTE_ON_POST,
    graphql: {
      query: gql`
        mutation VoteOnPostMutation($postId: ID, $isUpvote: Boolean) {
          vote(postId: $postId, isUpvote: $isUpvote) {
            id
            votesTotal
          }
        }
      `,
      variables: { postId, isUpvote }
    },
    meta: {
      postId,
      isUpvote,
      optimistic: true,
      analytics: AnalyticsEvents.VOTED_ON_POST
    }
  }
}
