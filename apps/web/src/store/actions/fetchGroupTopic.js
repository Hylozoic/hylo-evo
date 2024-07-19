import { FETCH_GROUP_TOPIC } from 'store/constants'

export default function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: `query ($groupSlug: String, $topicName: String) {
        groupTopic(groupSlug: $groupSlug, topicName: $topicName) {
          id
          followersTotal
          lastReadPostId
          postsTotal
          group {
            id
          }
          topic {
            id
            name
          }
        }
      }`,
      variables: {
        groupSlug,
        topicName
      }
    },
    meta: {
      extractModel: 'GroupTopic'
    }
  }
}
