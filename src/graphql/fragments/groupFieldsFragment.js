const groupFieldsFragment = ({ withTopics, withJoinQuestions }) => `
  id
  accessibility
  announcements: posts(isAnnouncement: true, sortBy: 'created', first: 3) {
    hasMore
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
      bannerUrl
      name
      slug
      visibility
    }
  }
  childGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
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
  events: posts(filter: "event", first: 1) {
    hasMore
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
  projects: posts(filter: "project", first: 8) {
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
  offersAndRequests: posts(filter: "offersAndRequests", first: 8) {
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
