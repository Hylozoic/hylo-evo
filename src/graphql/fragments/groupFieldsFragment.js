const groupFieldsFragment = ({ withTopics, withJoinQuestions, withPrerequisites, withExtensions, withWidgets = false }) => `
  id
  aboutVideoUri
  accessibility
  avatarUrl
  bannerUrl
  description
  geoShape
  location
  memberCount
  moderatorDescriptor
  moderatorDescriptorPlural
  name
  purpose
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
  agreements {
    items {
      id
      description
      order
      title
    }
  }
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
      groupRoles{
       items {
          name
          emoji
          active
          groupId
          responsibilities {
            id
            title
            description
          }
        }
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
  ${withTopics
    ? `
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
    }`
    : ''}
  ${withJoinQuestions
    ? `
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
    }`
    : ''}
  ${withPrerequisites
    ? `
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
    `
    : ''}
  ${withExtensions
    ? `
    groupExtensions {
      items {
        id
        data
        type
        active
      }
    }`
    : ''}
  ${withWidgets
    ? `
    widgets {
      items {
        id
        name
        context
        order
        isVisible
      }
    }`
    : ''}
`

export default groupFieldsFragment
