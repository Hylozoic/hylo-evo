import { FETCH_FOR_COMMUNITY } from 'store/constants'

export default function holochainFetchForCommunity (slug) {
  return {
    type: FETCH_FOR_COMMUNITY,
    graphql: {
      query: `query ($slug: String) {
        community(slug: $slug) {
          id
          name
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      holochainAPI: true,
      extractModel: 'Community',
      slug
    }
  }
}
