export default `query (
  $groupSlug: String,
  $autocomplete: String,
  $isDefault: Boolean,
  $visibility: [Int],
  $first: Int,
  $offset: Int,
  $sortBy: String
) {
  topics (
    groupSlug: $groupSlug,
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
        groupSlug: $groupSlug
      )
      followersTotal(
        groupSlug: $groupSlug
      )
      groupTopics(isDefault: $isDefault, visibility: $visibility) {
        items {
          id
          group {
            id
            name
            avatarUrl
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
