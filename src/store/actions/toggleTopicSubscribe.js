import { TOGGLE_TOPIC_SUBSCRIBE } from 'store/constants'

const query =
`mutation($topicId: ID, $communityId: ID, $isSubscribing: Boolean) {
  subscribe(topicId: $topicId, communityId: $communityId, isSubscribing: $isSubscribing) {
    id
    newPostCount
    community {
      id
    }
    topic {
      id
      name
    }
  }
}`

export default function toggleTopicSubscribe (topicId, communityId, existingSub) {
  return {
    type: TOGGLE_TOPIC_SUBSCRIBE,
    graphql: {
      query,
      variables: {
        topicId,
        communityId,
        isSubscribing: existingSub ? false : true // eslint-disable-line no-unneeded-ternary
      }
    },
    meta: {
      extractModel: 'TopicSubscription',
      existingSubscriptionId: existingSub && existingSub.id,
      topicId,
      communityId
    }
  }
}
