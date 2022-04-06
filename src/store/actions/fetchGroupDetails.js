import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails ({ slug, withExtensions = true, withWidgets = false }) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query ($slug: String) {
        group(slug: $slug) {
          ${groupFieldsFragment({ withTopics: true, withJoinQuestions: true, withPrerequisites: true, withExtensions, withWidgets })}
        }
      }`,
      variables: { slug }
    },
    meta: {
      extractModel: 'Group',
      slug
    }
  }
}
