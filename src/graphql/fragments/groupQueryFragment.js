import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

export default
`group(slug: $slug, updateLastViewed: $updateLastViewed) {
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
  name
  settings {
    allowGroupInvites
    askJoinQuestions
    publicMemberDirectory
  }
  slug
  visibility
  groupRelationshipInvitesFrom {
    items {
      id
      toGroup {
        id
        name
        slug
      }
      fromGroup {
        id
      }
      type
      createdBy {
        id
        name
      }
    }
  }
  groupRelationshipInvitesTo {
    items {
      id
      fromGroup {
        id
        name
        slug
      }
      toGroup {
        id
      }
      type
      createdBy {
        id
        name
      }
    }
  }
  childGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      description
      name
      slug
      visibility
      settings {
        allowGroupInvites
        askJoinQuestions
        publicMemberDirectory
      }
    }
  }
  parentGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      description
      name
      slug
      visibility
      settings {
        allowGroupInvites
        askJoinQuestions
        publicMemberDirectory
      }
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
      contactEmail
    }
  }
  moderators {
    items {
      id
      name
      avatarUrl
    }
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
  ${groupTopicsQueryFragment}
}`
