export default
`me {
  id
  isAdmin
  name
  avatarUrl
  newNotificationCount
  unseenThreadCount
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
  email
  bannerUrl
  bio
  contactEmail
  contactPhone
  tagline
  twitterName
  linkedinUrl
  facebookUrl
  url
  hasDevice
  intercomHash
  hasStripeAccount
  blockedUsers {
    id
    name
  }
  settings {
    signupInProgress
    digestFrequency
    dmNotifications
    commentNotifications
  }
  memberships {
    id
    lastViewedAt
    newPostCount
    hasModeratorRole
    settings {
      sendEmail
      sendPushNotifications
    }
    person {
      id
    }
    community {
      id
      name
      slug
      memberCount
      avatarUrl
      network {
        id
        slug
        name
        avatarUrl
        communities(first: 300) {
          items {
            id
            name
            slug
            avatarUrl
            memberCount
            network {
              id
            }
          }
        }
      }
    }
  }
}`
