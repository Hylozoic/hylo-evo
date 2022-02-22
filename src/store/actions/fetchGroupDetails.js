import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails (slug, withExtensions = true) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query ($slug: String) {
        group(slug: $slug) {
          ${groupFieldsFragment({ withTopics: true, withJoinQuestions: true, withPrerequisites: true, withExtensions })}
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
