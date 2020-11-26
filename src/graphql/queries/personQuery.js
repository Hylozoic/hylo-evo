export default
`query PersonDetails ($id: ID) {
  person (id: $id) {
    id
    name
    avatarUrl
    bannerUrl
    bio
    contactPhone
    contactEmail
    twitterName
    linkedinUrl
    facebookUrl
    url
    tagline
    location
    locationObject {
      id
      addressNumber
      addressStreet
      bbox {
        lat
        lng
      }
      center {
        lat
        lng
      }
      city
      country
      fullText
      locality
      neighborhood
      region
    }
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
    projects {
      items {
        id
        title
        createdAt
        creator {
          name
        }
        members {
          items {
            avatarUrl
          }
        }
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
