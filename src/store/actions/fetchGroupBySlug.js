import { FETCH_GROUP } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupBySlug (slug) {
  return {
    type: FETCH_GROUP,
    graphql: {
      query: `query ($slug: String) {
        group(slug: $slug) {
          ${groupFieldsFragment(true)}
        }
      }`,
      variables: { slug }
    },
    meta: { extractModel: 'Group' }
  }
}
