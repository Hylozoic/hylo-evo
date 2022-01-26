import gql from 'graphql-tag'
import { FETCH_TOPIC, FETCH_GROUP_TOPIC } from 'store/constants'

export const MODULE_NAME = 'Feed'
export const FETCH_NETWORK = `${MODULE_NAME}/FETCH_NETWORK`

export function fetchGroupTopic (topicName, groupSlug) {
  return {
    type: FETCH_GROUP_TOPIC,
    graphql: {
      query: gql`
        query GroupTopic2($groupSlug: String, $topicName: String) {
          groupTopic(groupSlug: $groupSlug, topicName: $topicName) {
            id
            postsTotal
            followersTotal
            topic {
              id
              name
            }
            group {
              id
            }
          }
        }
      `,
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

export function fetchTopic (name, id) {
  return {
    type: FETCH_TOPIC,
    graphql: {
      query: gql`
        query Topic($name: String, $id: ID) {
          topic(name: $name, id: $id) {
            id
            name
            postsTotal
            followersTotal
          }
        }
      `,
      variables: {
        name,
        id
      }
    },
    meta: {
      extractModel: 'Topic'
    }
  }
}
