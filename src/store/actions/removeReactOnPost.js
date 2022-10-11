import { REMOVE_REACT_ON_POST } from 'store/constants'
import { AnalyticsEvents } from 'hylo-shared'

export default function removeReactOnPost (postId, emojiFull) {
  const data = { emojiFull, entityType: 'post' }
  console.log({ postId, data })
  return {
    type: REMOVE_REACT_ON_POST,
    graphql: {
      query: `mutation($entityId: ID, $data: ReactionInput) {
        deleteReaction(entityId: $entityId, data: $data) {
          myReactions {
            emojiFull
            id
          }
          postReactions {
            emojiFull
            id
            user {
              id
              name
            }
          }
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
