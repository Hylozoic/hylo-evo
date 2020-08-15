import { get, omit } from 'lodash/fp'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = 'CreateTopic'
export const CREATE_TOPIC = `${MODULE_NAME}/CREATE_TOPIC`
export const FETCH_COMMUNITY_TOPIC = `${MODULE_NAME}/FETCH_COMMUNITY_TOPIC`

export function fetchCommunityTopic (topicName, communitySlug) {
  return {
    type: FETCH_COMMUNITY_TOPIC,
    graphql: {
      query: `query ($topicName: String, $communitySlug: String) {
        communityTopic(communitySlug: $communitySlug, topicName: $topicName) {
          id
        }
      }`,
      variables: {
        communitySlug,
        topicName
      }
    },
    meta: {
      communitySlug,
      topicName
    }
  }
}

export function createTopic (topicName, communityId, isDefault = false, isSubscribing = false) {
  return {
    type: CREATE_TOPIC,
    graphql: {
      query: `mutation ($topicName: String, $communityId: ID, $isDefault: Boolean, $isSubscribing: Boolean) {
        createTopic(topicName: $topicName, communityId: $communityId, isDefault: $isDefault, isSubscribing: $isSubscribing) {
          id
          name
          communityTopics {
            items {
              id
              community {
                id
                slug
              }
              isDefault
              isSubscribed
              newPostCount
              postsTotal
              followersTotal
              visibility
            }
          }
          followersTotal
          postsTotal
        }
      }`,
      variables: {
        communityId,
        topicName,
        isDefault,
        isSubscribing
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
      ],
      data: {
        topicName,
        communityId,
        isDefault
      },
      analytics: AnalyticsEvents.TOPIC_CREATED
    }
  }
}

export default function reducer (state = {}, action) {
  const { meta, payload, type } = action
  switch (type) {
    case CREATE_TOPIC:
      const topicName = get('data.createTopic.name', payload)
      // Once '#foo' is created, reset store['foo'], even if it wipes out checks
      // on the same topic for other communities... safer to start fresh.
      return omit(encodeURI(topicName), state)

    case FETCH_COMMUNITY_TOPIC:
      return {
        ...state,
        [encodeURI(meta.topicName)]: {
          [meta.communitySlug]: !!payload.data.communityTopic
        }
      }
  }

  return state
}
