import gql from 'graphql-tag'

export default gql`
  fragment GroupTopicQuerySetFragment on GroupTopicQuerySet {
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
`
