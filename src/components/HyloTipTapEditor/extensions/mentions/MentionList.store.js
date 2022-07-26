export const FIND_MENTIONS = 'FIND_MENTIONS'
export const FIND_MENTIONS_PENDING = 'FIND_MENTIONS_PENDING'

// Action Creators
export function findMentions ({ autocomplete, groupIds }) {
  return {
    type: FIND_MENTIONS,
    graphql: {
      query: `query ($autocomplete: String, $groupIds: [String]) {
        people(autocomplete: $autocomplete, first: 5, groupIds: $groupIds) {
          items {
            id
            name
            avatarUrl
          }
        }
      }`,
      variables: {
        autocomplete,
        groupIds
      }
    },
    meta: { extractModel: 'Person' }
  }
}
