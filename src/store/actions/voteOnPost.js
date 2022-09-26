import { REACT_ON_POST } from 'store/constants'
import { AnalyticsEvents } from 'hylo-shared'

export default function reactOnPost (postId, data) {

  console.log(postId, data)
  return {
    type: REACT_ON_POST,
    graphql: {
      query: `mutation($entityId: ID, $data: ReactionInput) {
        vote(entityId: $entityId, data: $data) {
          id
        }
      }`,
      variables: { entityId: postId, data }
    },
    meta: {
      postId,
      data,
      optimistic: true,
      analytics: AnalyticsEvents.VOTED_ON_POST
    }
  }
}
