import { FETCH_GROUP } from 'store/constants'
import groupFieldsFragment from 'graphql/fragments/groupFieldsFragment'

export default function fetchGroupDetails (id) {
  return {
    type: FETCH_GROUP,
    graphql: {
      query: `query ($id: ID) {
        group(id: $id) {
          ${groupFieldsFragment(true)}
        }
      }`,
      variables: { id }
    },
    meta: { extractModel: 'Group' }
  }
}
