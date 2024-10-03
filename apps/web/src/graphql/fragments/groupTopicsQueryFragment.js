export default
`groupTopics(
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
    lastReadPostId
    newPostCount
    postsTotal
    visibility
    group {
      id
    }
    topic {
      id
      name
    }
  }
}
`
