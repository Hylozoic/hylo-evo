export default
`communityTopics(
  first: $first,
  offset: $offset,
  sortBy: $sortBy,
  order: $order,
  subscribed: $subscribed,
  autocomplete: $autocomplete
) {
  hasMore
  total
  items {
    id
    followersTotal
    isDefault
    isSubscribed
    newPostCount
    postsTotal
    visibility
    community {
      id
    }
    topic {
      id
      name
    }
  }
}
`
