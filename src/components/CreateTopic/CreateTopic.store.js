import { get, omit } from 'lodash/fp'
import gql from 'graphql-tag'
import { AnalyticsEvents } from 'hylo-utils/constants'

export const MODULE_NAME = 'CreateTopic'
export const CREATE_TOPIC = `${MODULE_NAME}/CREATE_TOPIC`
export const FETCH_GROUP_TOPIC = `${MODULE_NAME}/FETCH_GROUP_TOPIC`

export function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: gql`
        query GroupTopic($topicName: String, $groupSlug: String) {
          groupTopic(groupSlug: $groupSlug, topicName: $topicName) {
            id
          }
        }
      `,
      variables: {
        groupSlug,
        topicName
      }
    },
    meta: {
      groupSlug,
      topicName
    }
  }
}

export function createTopic (topicName, groupId, isDefault = false, isSubscribing = false) {
  return {
    type: CREATE_TOPIC,
    graphql: {
      query: gql`
        mutation CreateTopic($topicName: String, $groupId: ID, $isDefault: Boolean, $isSubscribing: Boolean) {
          createTopic(topicName: $topicName, groupId: $groupId, isDefault: $isDefault, isSubscribing: $isSubscribing) {
            id
            name
            groupTopics {
              items {
                id
                group {
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
        }
      `,
      variables: {
        groupId,
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
          modelName: 'GroupTopic',
          getRoot: get('createTopic.groupTopics')
        }
      ],
      data: {
        topicName,
        groupId,
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
      // on the same topic for other groups... safer to start fresh.
      return omit(encodeURI(topicName), state)

    case FETCH_GROUP_TOPIC:
      return {
        ...state,
        [encodeURI(meta.topicName)]: {
          [meta.groupSlug]: !!payload.data.groupTopic
        }
      }
  }

  return state
}
