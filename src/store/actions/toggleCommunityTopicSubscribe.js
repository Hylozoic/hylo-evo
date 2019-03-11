import { TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE } from 'store/constants'

const query =
`mutation($topicId: ID, $communityId: ID, $isSubscribing: Boolean) {
  subscribe(topicId: $topicId, communityId: $communityId, isSubscribing: $isSubscribing) {
    success
  }
}`

export default function (communityTopic) {
  const { topic, community, isSubscribed } = communityTopic
  const topicId = topic.id
  const communityId = community.id
  const isSubscribing = !isSubscribed

  return {
    type: TOGGLE_COMMUNITY_TOPIC_SUBSCRIBE,
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
      topicId,
      communityId,
      isSubscribing
    }
  }
}
