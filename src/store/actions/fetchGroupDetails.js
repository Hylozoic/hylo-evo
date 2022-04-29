import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails (slug) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query GroupDetailsQuery ($slug: String) {
        group(slug: $slug) {
          ${groupFieldsFragment({ withTopics: true, withJoinQuestions: true, withPrerequisites: true })}
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
