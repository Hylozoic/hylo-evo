import gql from 'graphql-tag'

export const MODULE_NAME = 'FlagContent'

// Constants
export const FLAG_CONTENT = `${MODULE_NAME}/FLAG_CONTENT`

// Action Creators
export function submitFlagContent (category, reason, linkData) {
  return {
    type: FLAG_CONTENT,
    graphql: {
      query: gql`
        mutation FlagContentMutation($category: String, $reason: String, $linkData: LinkDataInput) {
          flagInappropriateContent(data: {category: $category, reason: $reason, linkData: $linkData}) {
            success
          }
        }
      `,
      variables: {
        category,
        reason,
        linkData
      }
    },
    meta: {
      optimistic: true
    }
  }
}
