import { FETCH_PERSON } from 'store/constants'

const defaultQuery =
`query PersonWithPosts ($id: ID) {
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
}`

export function fetchPerson (id, query = defaultQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    }
  }
}
