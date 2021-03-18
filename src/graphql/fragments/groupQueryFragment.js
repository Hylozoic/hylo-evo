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
  name
  locationObject {
    fullText
    city
    country
  }
  settings {
    allowGroupInvites
    publicMemberDirectory
  }
  slug
  visibility
  childGroups {
    items {
      id
      slug
      name
      avatarUrl
      childGroups(first: 300) {
        items {
          id
        }
      }
    }
  }
  parentGroups {
    items {
      id
      slug
      name
      avatarUrl
      childGroups(first: 300) {
        items {
          id
        }
      }
    }
  }
  memberCount
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
