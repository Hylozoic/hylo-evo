export default
`query ($groupId: ID) {
  joinRequests (groupId: $groupId) {
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
