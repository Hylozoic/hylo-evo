import { get } from 'lodash/fp'
import gql from 'graphql-tag'
import { FIND_TOPICS } from 'store/constants'

export default function findTopics (autocomplete) {
  return {
    type: FIND_TOPICS,
    graphql: {
      query: gql`
        query FindTopicsQuery ($autocomplete: String) {
          groupTopics(autocomplete: $autocomplete, first: 7) {
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

const collectTopics = results => results.groupTopics.items.map(get('topic'))
