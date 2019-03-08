module.exports.registerQuery = `
mutation ($id: ID, $name: String, $avatarUrl: String) {
  registerUser(id: $id, name: $name, avatarUrl: $avatarUrl) {
    success
  }
}
`

module.exports.getPeopleQuery = `
query PeopleContacts ($first: Int) {
  people (first: $first) {
    items {
      id
      name
      avatarUrl
      memberships (first: 1) {
        id
        community {
          id
          name
        }
      }
    }
  }
}
`

module.exports.getMessageThreadsQuery = `
query ($first: Int, $offset: Int) {
  me {
    id
    messageThreads(sortBy: "updatedAt", order: "desc", first: $first, offset: $offset) {
      total
      hasMore
      items {
        id
        unreadCount
        lastReadAt
        createdAt
        updatedAt
        participants {
          id
          name
          avatarUrl
        }
        messages(first: 1, order: "desc") {
          items {
            id
            createdAt
            text
            creator {
              id
              name
            }
          }
        }
      }
    }
  }
}`

module.exports.findOrCreateThreadQuery =`
mutation ($participantIds: [String]) {
  findOrCreateThread(data: {participantIds: $participantIds}) {
    id
    createdAt
    updatedAt
    participants {
      id
      name
      avatarUrl
    }
  }
}`

module.exports.createMessageQuery = `
mutation ($messageThreadId: String, $text: String) {
  createMessage(data: {messageThreadId: $messageThreadId, text: $text}) {
    id
    text
    createdAt
    creator {
      id
    }
    messageThread {
      id
    }
  }
}`

module.exports.getMessagesQuery = `
  query ($id: ID, $cursor: ID) {
    messageThread (id: $id) {
      id
      messages(first: 80, cursor: $cursor, order: "desc") {
        items {
          id
          createdAt
          text
          creator {
            id
            name
            avatarUrl
          }
        }
        total
        hasMore
      }
    }
  }
`
