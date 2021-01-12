import { FETCH_COMMUNITY } from 'store/constants'

export default function fetchCommunityBySlug (slug) {
  return {
    type: FETCH_COMMUNITY,
    graphql: {
      query: `query ($slug: String) {
        community (slug: $slug) {
          id
          name
          slug
          avatarUrl
          bannerUrl
          description
          locationObject {
            fullText
          }
          settings
          invitePath
          hidden
          allowCommunityInvites
          isPublic
          isAutoJoinable
          publicMemberDirectory
          moderators (first: 100) {
            hasMore
            items {
              id
              name
              avatarUrl
            }
          }
        }
      }`,
      variables: {
        slug
      }
    },
    meta: {
      extractModel: 'Community'
    }
  }
}
