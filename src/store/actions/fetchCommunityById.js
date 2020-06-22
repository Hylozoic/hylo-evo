import { FETCH_COMMUNITY } from 'store/constants'
import fetchCommunityQuery from 'graphql/queries/fetchCommunityQuery'

export default function fetchCommunityById (id, query = fetchCommunityQuery) {
  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query,
      variables: { id }
    },
    meta: { extractModel: 'Community' }
  }
}
