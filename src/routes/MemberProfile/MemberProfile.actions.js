import { FETCH_PERSON } from 'store/constants'

const fetchPersonQuery =
`query PersonWithPosts ($id: ID) {
  person (id: $id) {
    id
    name
    avatarUrl
    bannerUrl
    bio
    twitterName
    linkedinUrl
    facebookUrl
    url
    location
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

export function fetchPerson (id, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id }
    }
  }
}
