import { FETCH_COMMUNITY } from 'store/constants'

export function fetchCommunity ({ communityName }) {
  const extractModel = 'Community'
  var query = communityQuery

  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query,
      variables: {
        slug: communityName
      }
    },
    meta: {
      extractModel
    }
  }
}

const communityQuery = `query (
  $slug: String
) {
  community(slug: $slug) {
    id
  }
}`
