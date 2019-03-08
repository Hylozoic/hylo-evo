export default `query (
  $communitySlug: String,
  $networkSlug: String,
  $autocomplete: String
  $first: Int,
  $offset: Int,
  $sortBy: String
) {
  topics (
    communitySlug: $communitySlug,
    networkSlug: $networkSlug,
    autocomplete: $autocomplete,
    first: $first,
    offset: $offset,
    sortBy: $sortBy
  ) {
    hasMore
    total
    items {
      id
      name
      postsTotal(
        communitySlug: $communitySlug,
        networkSlug: $networkSlug
      )
      followersTotal(
        communitySlug: $communitySlug,
        networkSlug: $networkSlug
      )
      communityTopics {
        items {
          id
          community {
            id
            name
            avatarUrl
            network {
              id
              slug
            }
          }
          postsTotal
          followersTotal
          isSubscribed
          newPostCount
        }
      }
    }
  }
}`
