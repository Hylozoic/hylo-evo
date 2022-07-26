import { get } from 'lodash/fp'
import { FIND_TOPICS } from 'store/constants'

export default function findTopics (autocomplete) {
  return {
    type: FIND_TOPICS,
    graphql: {
      query: `query ($autocomplete: String) {
        groupTopics(autocomplete: $autocomplete, first: 8) {
          items {
            topic {
              id
              name
              followersTotal
              postsTotal
            }
          }
        }
      }`,
      variables: {
        autocomplete
      }
    },
    meta: {
      extractModel: {
        getRoot: collectTopics,
        modelName: 'Topic',
        append: true
      }
    }
  }
}

// Moved to TopicSelector.store
const collectTopics = results => results.groupTopics.items.map(get('topic'))
