import { FETCH_PERSON } from 'store/constants'

export function getPerson (id) {
  return {
    type: FETCH_CURRENT_USER,
    graphql: {
      query: `{
        person (id: "${id}") {
          id
          name
          avatarUrl
          posts {
            id
            title
            details
            type
            creator {
              id
              name
              avatarUrl
            }
          }
          postsTotal
        }
      }`
    }
  }
}
