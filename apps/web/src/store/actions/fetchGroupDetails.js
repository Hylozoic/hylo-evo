import { FETCH_GROUP_DETAILS } from 'store/constants'
import groupFieldsFragment from '@graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails ({
  slug,
  withExtensions = true,
  withWidgets = false,
  withTopics = true,
  withJoinQuestions = true,
  withPrerequisites = true
}) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: `query GroupDetailsQuery ($slug: String) {
        group(slug: $slug) {
          ${groupFieldsFragment({ withTopics, withJoinQuestions, withPrerequisites, withExtensions, withWidgets })}
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
