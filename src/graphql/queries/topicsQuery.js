export default `query (
  $communitySlug: String,
  $networkSlug: String,
  $autocomplete: String,
  $isDefault: Boolean,
  $visibility: [Int],
  $first: Int,
  $offset: Int,
  $sortBy: String
) {
  topics (
    communitySlug: $communitySlug,
    networkSlug: $networkSlug,
    autocomplete: $autocomplete,
    isDefault: $isDefault,
    visibility: $visibility,
    first: $first,
    offset: $offset,
    sortBy: $sortBy,
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
      communityTopics(isDefault: $isDefault, visibility: $visibility) {
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
          isDefault
          visibility
        }
      }
    }
  }
}`
