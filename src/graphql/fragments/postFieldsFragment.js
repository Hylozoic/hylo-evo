const postFieldsFragment = withComments => `
  id
  announcement
  title
  details
  type
  creator {
    id
    name
    avatarUrl
  }
  createdAt
  updatedAt
  isPublic
  fulfilledAt
  startTime
  endTime
  myEventResponse
  commenters(first: 3) {
    id
    name
    avatarUrl
  }
  commentersTotal
  ${withComments ? `comments(first: 10, order: "desc") {
    items {
      id
      text
      creator {
        id
        name
        avatarUrl
      }
      attachments {
        id
        position
        type
        url
      }
      createdAt
    }
    total
    hasMore
  }` : ''}
  linkPreview {
    id
    title
    url
    imageUrl
  }
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
  votesTotal
  myVote
  acceptContributions
  totalContributions
  groups {
    id
    name
    slug
  }
  attachments {
    type
    url
    position
    id
  }
  postMemberships {
    id
    pinned
    group {
      id
    }
  }
  topics {
    id
    name
    postsTotal
    followersTotal
  }
  members {
    total
    hasMore
    items {
      id
      name
      avatarUrl
      bio
      tagline
      location
      skills (first: 100) {
        items {
          id
          name
        }
      }
    }
  }
  eventInvitations {
    total
    hasMore
    items {
      id
      response
      person {
        id
        name
        avatarUrl
        bio
        tagline
        location
        skills (first: 100) {
          items {
            id
            name
          }
        }
      }
    }
  }`

export default postFieldsFragment
