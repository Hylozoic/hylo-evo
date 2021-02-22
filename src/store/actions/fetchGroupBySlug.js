import { FETCH_GROUP } from 'store/constants'
import fetchGroupQuery from 'graphql/queries/fetchGroupQuery'

export default function fetchGroupBySlug (slug, query = fetchGroupQuery(true)) {
  return {
    type: FETCH_GROUP,
    graphql: {
      query,
      variables: { slug }
    },
    meta: { extractModel: 'Group' }
  }
}
