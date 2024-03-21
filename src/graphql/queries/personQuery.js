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
    eventsAttending {
      items {
        id
        title
        location
        startTime
        eventInvitations {
          items {
            response
            person {
              avatarUrl
            }
          }
        }
      }
    }
    messageThreadId
    affiliations {
      items {
        id
        role
        preposition
        orgName
        url
        createdAt
        updatedAt
        isActive
      }
    }
    memberships {
      id
      role
      hasModeratorRole
      group {
        id
        name
        slug
      }
      person {
        id
      }
      commonRoles {
        items {
          id
          name
          description
          emoji
          responsibilities {
            items {
              id
              title
              description
            }
          }
        }
      }
    }
    groupRoles {
      items {
         name
         emoji
         active
         groupId
         responsibilities {
          items {
            id
            title
            description
          }
        }
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
