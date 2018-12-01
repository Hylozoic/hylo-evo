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
    postsTotal
    followersTotal
    isSubscribed
    newPostCount
    topic {
      id
      name
    }
  }
}
`
