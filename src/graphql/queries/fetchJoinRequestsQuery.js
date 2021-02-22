export default
`query ($groupId: ID) {
  joinRequests (groupId: $groupId) {
    total
    hasMore
    items {
      id
      status
      createdAt
      questionAnswers {
        id
        question {
          id
          text
        }
        answer
      }
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
