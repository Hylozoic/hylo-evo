export default
`me {
  id
  isAdmin
  name
  avatarUrl
  newNotificationCount
  unseenThreadCount
  locationText
  location {
    addressNumber
    addressStreet
  }
  email
  bannerUrl
  bio
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
    community {
      id
      name
      slug
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
            network {
              id
            }
          }
        }
      }
    }
  }
}`
