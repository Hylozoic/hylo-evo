import { TOGGLE_GROUP_TOPIC_SUBSCRIBE } from 'store/constants'

const query =
`mutation($topicId: ID, $groupId: ID, $isSubscribing: Boolean) {
  subscribe(topicId: $topicId, groupId: $groupId, isSubscribing: $isSubscribing) {
    success
  }
}`

export default function (groupTopic) {
  const { topic, group, isSubscribed } = groupTopic
  const topicId = topic.id
  const groupId = group.id
  const isSubscribing = !isSubscribed

  return {
    type: TOGGLE_GROUP_TOPIC_SUBSCRIBE,
    graphql: {
      query,
      variables: {
        topicId,
        groupId,
        isSubscribing
      }
    },
    meta: {
      optimistic: true,
      topicId,
      groupId,
      isSubscribing
    }
  }
}
