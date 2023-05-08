const groupFieldsFragment = ({ withTopics, withJoinQuestions, withPrerequisites, withExtensions, withWidgets = false }) => `
  id
  aboutVideoUri
  accessibility
  avatarUrl
  bannerUrl
  customViews {
    items {
      id
      activePostsOnly
      collectionId
      defaultSort
      defaultViewMode
      externalLink
      groupId
      isActive
      icon
      name
      order
      postTypes
      topics {
        id
        name
      }
      type
    }
  }
  description
  geoShape
  location
  memberCount
  moderatorDescriptor
  moderatorDescriptorPlural
  name
  settings {
    allowGroupInvites
    askGroupToGroupJoinQuestions
    askJoinQuestions
    hideExtensionData
    locationDisplayPrecision
    publicMemberDirectory
    showSuggestedSkills
  }
  slug
  type
  typeDescriptor
  typeDescriptorPlural
  visibility
  childGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      geoShape
      memberCount
      name
      slug
      visibility
    }
  }
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
      groupRoles {
        name
        emoji
        active
        groupId
      }
    }
  }
  parentGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      geoShape
      name
      slug
      visibility
    }
  }
  ${withTopics ? `
  groupTopics(first: 8) {
    items {
      id
      lastReadPostId
      topic {
        id
        name
      }
      postsTotal
    }
  }` : ''}
  ${withJoinQuestions ? `
  joinQuestions {
    items {
      id
      questionId
      text
    }
  }
  suggestedSkills {
    items {
      id
      name
    }
  }` : ''}
  ${withPrerequisites ? `
  prerequisiteGroups(onlyNotMember: true) {
    items {
      avatarUrl
      id
      name
      settings {
        allowGroupInvites
        askGroupToGroupJoinQuestions
        askJoinQuestions
        hideExtensionData
        locationDisplayPrecision
        publicMemberDirectory
        showSuggestedSkills
      }
      slug
    }
  }
  numPrerequisitesLeft
  ` : ''}
  ${withExtensions ? `
  groupExtensions {
    items {
      id
      data
      type
      active
    }
  }` : ''}
  ${withWidgets ? `
  widgets {
    items {
      id
      name
      context
      order
      isVisible
    }
  }` : ''}
`

export default groupFieldsFragment
