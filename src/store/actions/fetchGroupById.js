import { FETCH_GROUP } from 'store/constants'
import fetchGroupQuery from 'graphql/queries/fetchGroupQuery'

export default function fetchGroupById (id, query = fetchGroupQuery) {
  return {
    type: FETCH_GROUP,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Group' }
  }
}
