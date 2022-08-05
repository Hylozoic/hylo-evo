import gql from 'graphql-tag'
import { FIND_MENTIONS } from 'store/constants'

export default function findMentions ({ autocomplete, groupIds, maxItems = 5 }) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: gql`
        query FindPeopleForMentions ($autocomplete: String, $groupIds: [String], $maxItems: Int) {
          people(autocomplete: $autocomplete, first: $maxItems, groupIds: $groupIds) {
            items {
              id
              name
              avatarUrl
            }
          }
        }
      `,
      variables: {
        autocomplete,
        groupIds,
        maxItems
      }
    },
    meta: { extractModel: 'Person' }
  }
}
