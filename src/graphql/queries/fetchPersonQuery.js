export default
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
    tagline
    location
    messageThreadId
    memberships {
      id
      role
      hasModeratorRole
      community {
        id
        name
        slug
      }
    }
    skills (first: 100) {
      total
      hasMore
      items {
        id
        name
      }
    }
  }
}`
