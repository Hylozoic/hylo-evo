export default
`query ($communityId: ID) {
  joinRequests (communityId: $communityId) {
    total
    hasMore
    items {
      id
      status
      createdAt
      user {
        id
        avatarUrl
        name
        skills {
          items {
            id
            name
          }
        }
      }
    }
  }
}`
