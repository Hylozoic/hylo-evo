import { TOGGLE_TOPIC_SUBSCRIBE } from 'store/constants'

const query =
`mutation($topicId: ID, $communityId: ID, $isSubscribing: Boolean) {
  subscribe(topicId: $topicId, communityId: $communityId, isSubscribing: $isSubscribing) {
    success
  }
}`

export default function toggleTopicSubscribe (topicId, communityId, isSubscribing) {
  return {
    type: TOGGLE_TOPIC_SUBSCRIBE,
    graphql: {
      query,
      variables: {
        topicId,
        communityId,
        isSubscribing
      }
    },
    meta: {
      optimistic: true,
      isSubscribing,
      topicId,
      communityId
    }
  }
}
