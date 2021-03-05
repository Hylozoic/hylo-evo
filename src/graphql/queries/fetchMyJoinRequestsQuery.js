export default
`query {
  me {
    joinRequests {
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
        group {
          id
          name
          avatarUrl
        }
      }
    }
  }
}`
