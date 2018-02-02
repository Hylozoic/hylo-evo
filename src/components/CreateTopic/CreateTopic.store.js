import { uniqueId } from 'lodash/fp'

const MODULE_NAME = 'CreateTopic'
export const CREATE_TOPIC = `${MODULE_NAME}/CREATE_TOPIC`
export const CREATE_TOPIC_PENDING = `${MODULE_NAME}/CREATE_TOPIC_PENDING`

export function createTopic (topicName, communityId) {
  return {
    type: CREATE_TOPIC,
    graphql: {
      query: `mutation ($topicName: String, $communityId: ID) {
        createTopic(topicName: $topicName, communityId: $communityId) {
          id
          name
          postsTotal
          communityTopics {
            items {
              community {
                id
                name
              }
            }
          }
        }
      }`,
      variables: {
        communityId,
        topicName
      }
    },
    meta: {
      communityId,
      communityTopicTempId: uniqueId(`communityTopic${communityId}_`),
      topicName,
      optimistic: true,
      tempId: uniqueId(`topic${communityId}_`)
    }
  }
}
