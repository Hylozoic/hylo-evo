import { FETCH_PERSON } from 'store/constants'

const fetchPersonQuery =
`query PersonDetails ($id: ID) {
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
    memberships {
      id
      role
      hasModeratorRole
      community {
        id
        name
      }
    }
    membershipsTotal
    posts {
      id
      title
      details
      type
      creator {
        id
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
