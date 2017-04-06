import { FETCH_PERSON } from 'store/constants'

export function fetchPerson (id) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query: `query PersonWithPosts ($id: ID) {
        person (id: $id) {
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
      }`,
      variables: { id }
    }
  }
}
