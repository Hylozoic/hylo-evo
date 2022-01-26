import gql from 'graphql-tag'
import { FETCH_GROUP_DETAILS } from 'store/constants'
import GroupFieldsFragment from 'graphql/GroupFieldsFragment'

export default function fetchGroupDetails (slug) {
  return {
    type: FETCH_GROUP_DETAILS,
    graphql: {
      query: gql`
        query GroupDetailsQuery(
          $slug: String
          $withTopics: Boolean = true
          $withJoinQuestions: Boolean = true
          $withPrerequisites: Boolean = true
        ) {
          group(slug: $slug) {
            ...GroupFieldsFragment
          }
        }
        ${GroupFieldsFragment}
      `,
      variables: { slug }
    },
    meta: {
      extractModel: 'Group',
      slug
    }
  }
}
