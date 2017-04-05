import { FETCH_PERSON } from 'store/constants'

export function fetchPerson (id) {
  return {
    type: FETCH_PERSON,
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
