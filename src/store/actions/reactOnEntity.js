import { REACT_ON_POST, REACT_ON_COMMENT } from 'store/constants'
import { AnalyticsEvents } from 'hylo-shared'

export default function reactOnEntity ({ commentId, emojiFull, entityType, postId }) {
  const data = { emojiFull, entityType }
  return {
    type: entityType === 'post' ? REACT_ON_POST : REACT_ON_COMMENT,
    graphql: {
      query: `mutation($entityId: ID, $data: ReactionInput) {
        reactOn(entityId: $entityId, data: $data) {
          id
        }
      }`,
      variables: { entityId: commentId || postId, data }
    },
    meta: {
      postId,
      commentId,
      data,
      optimistic: true,
      analytics: AnalyticsEvents.VOTED_ON_POST
    }
  }
}
