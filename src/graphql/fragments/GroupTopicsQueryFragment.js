import gql from 'graphql-tag'

export default gql`
  fragment GroupTopicsQueryFragment on Group {
    groupTopics(
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
        group {
          id
        }
        topic {
          id
          name
        }
      }
    }
  }
`
