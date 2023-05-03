import { REACT_ON_POST, REACT_ON_COMMENT } from 'store/constants'
import { AnalyticsEvents } from 'hylo-shared'

export default function reactOnEntity ({ commentId, emojiFull, entityType, postId, groupIds }) {
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
      analytics: {
        commentId,
        eventName: entityType === 'post' ? AnalyticsEvents.POST_REACTION : AnalyticsEvents.COMMENT_REACTION,
        emoji: emojiFull,
        groupId: groupIds,
        postId,
        type: entityType === 'post' ? 'post' : 'comment'
      }
    }
  }
}
