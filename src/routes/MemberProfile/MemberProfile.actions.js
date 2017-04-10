import { FETCH_PERSON } from 'store/constants'

const fetchPersonQuery =
`query PersonDetails ($slug: String, $id: ID) {
  community (slug: $slug) {
    id,
    name,
    avatarUrl
    members (id: $id) {
      id
      name
      avatarUrl
      bannerUrl
      bio
      twitter_name
      linkedin_url
      facebook_url
      url
      location
      memberships {
        id
        role
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
  }
}`

export function fetchPerson (id, slug, query = fetchPersonQuery) {
  return {
    type: FETCH_PERSON,
    graphql: {
      query,
      variables: { id, slug }
    }
  }
}
