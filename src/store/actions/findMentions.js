import gql from 'graphql-tag'
import { FIND_MENTIONS } from 'store/constants'

export default function findMentions ({ autocomplete, groupIds }) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: gql`
        query FindPeopleForMentions ($autocomplete: String, $groupIds: [String]) {
          people(autocomplete: $autocomplete, first: 5, groupIds: $groupIds) {
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
        groupIds
      }
    },
    meta: { extractModel: 'Person' }
  }
}
