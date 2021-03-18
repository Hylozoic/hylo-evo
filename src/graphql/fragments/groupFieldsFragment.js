const groupFieldsFragment = ({ withTopics, withJoinQuestions }) => `
  id
  accessibility
  announcements {
    items {
      id
      title
      createdAt
      creator {
        id
        name
      }
      attachments {
        position
        url
      }
    }
  }
  avatarUrl
  bannerUrl
  description
  name
  settings {
    allowGroupInvites
    askJoinQuestions
    publicMemberDirectory
  }
  slug
  visibility
  parentGroups {
    items {
      id
      accessibility
      avatarUrl
      name
      slug
      visibility
      childGroups(first: 300) {
        items {
          id
        }
      }
    }
  }
  childGroups {
    items {
      id
      accessibility
      avatarUrl
      name
      slug
      visibility
    }
  }
  memberCount
  activeMembers(first: 8, sortBy: "last_active_at", order: "desc") {
    items {
      id
      name
      lastActiveAt
      avatarUrl
      contactEmail
    }
  }
  members(first: 8, sortBy: "name", order: "desc") {
    items {
      id
      name
      avatarUrl
    }
  }
  moderators {
    items {
      id
      name
      avatarUrl
    }
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
  widgets {
    items {
      id
      name
      isVisible
      order
      settings {
        text
        title
      }
    }
  }
  events {
    items {
      id
      title
      startTime
      endTime
      location
      members {
        items {
          avatarUrl
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
  offersAndRequests {
    items {
      id
      title
      creator {
        name
        avatarUrl
      }
      commentersTotal
    }
  }
  ${withTopics ? `groupTopics(first: 8) {
    items {
      id
      topic {
        id
        name
      }
      postsTotal
    }
  }` : ''}
  ${withJoinQuestions ? `joinQuestions {
    items {
      id
      questionId
      text
    }
  }` : ''}
`

export default groupFieldsFragment
