import { get } from 'lodash/fp'

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
          communityTopics {
            items {
              id
              community {
                id
              }
              isSubscribed
              newPostCount
              postsTotal
              followersTotal
            }
          }
          followersTotal
          postsTotal
        }
      }`,
      variables: {
        communityId,
        topicName
      }
    },
    meta: {
      extractModel: [
        {
          modelName: 'Topic',
          getRoot: get('createTopic')
        },
        {
          modelName: 'CommunityTopic',
          getRoot: get('createTopic.communityTopics')
        }
      ]
    }
  }
}
