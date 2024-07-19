import { get } from 'lodash/fp'
import gql from 'graphql-tag'
import { FIND_TOPICS } from 'store/constants'

export default function findTopics ({ autocomplete, maxItems = 7 }) {
  return {
    type: FIND_TOPICS,
    graphql: {
      query: gql`
        query FindTopicsQuery ($autocomplete: String, $maxItems: Int) {
          groupTopics(autocomplete: $autocomplete, first: $maxItems) {
            items {
              topic {
                id
                name
                followersTotal
                postsTotal
              }
            }
          }
        }
      `,
      variables: {
        autocomplete,
        maxItems
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

const collectTopics = results => results.groupTopics.items.map(get('topic'))
