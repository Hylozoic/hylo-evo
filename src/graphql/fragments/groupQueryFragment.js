import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

// TODO: dont load all this unless looking at the explore page

export default () => {
  return `group(slug: $slug, updateLastViewed: $updateLastViewed) {
    id
    aboutVideoUri
    accessibility
    avatarUrl
    bannerUrl
    customViews {
      items {
        id
        activePostsOnly
        externalLink
        isActive
        icon
        name
        postTypes
        viewMode
        order
      }
    }
    description
    type
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
    typeDescriptor
    typeDescriptorPlural
    visibility
    activeProjects: posts(filter: "project", sortBy: "updated", order: "desc", first: 4) {
      items {
        id
        title
        createdAt
        updatedAt
        creator {
          id
          name
        }
        members {
          items {
            id
            avatarUrl
            name
          }
        }
      }
    }
    announcements: posts(isAnnouncement: true, sortBy: "created", order: "desc", first: 3) {
      hasMore
      items {
        id
        title
        createdAt
        creator {
          id
          name
        }
        attachments(type: "image") {
          position
          url
        }
      }
    }
    childGroups {
      items {
        id
        accessibility
        avatarUrl
        type
        bannerUrl
        description
        memberCount
        name
        slug
        visibility
        settings {
          allowGroupInvites
          askGroupToGroupJoinQuestions
          askJoinQuestions
          hideExtensionData
          locationDisplayPrecision
          publicMemberDirectory
          showSuggestedSkills
        }
      }
    }
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
        questionAnswers {
          id
          question {
            id
            text
          }
          answer
        }
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
    members(first: 8, sortBy: "last_active_at", order: "desc") {
      items {
        id
        avatarUrl
        lastActiveAt
        name
      }
    }
    moderators {
      items {
        id
        avatarUrl
        lastActiveAt
        name
      }
    }
    openOffersAndRequests: posts(types: ["offer", "request"], isFulfilled: false, first: 4) {
      items {
        id
        title
        type
        creator {
          id
          name
          avatarUrl
        }
        commentsTotal
      }
    }
    parentGroups {
      items {
        id
        accessibility
        avatarUrl
        bannerUrl
        description
        type
        name
        slug
        visibility
        settings {
          allowGroupInvites
          askGroupToGroupJoinQuestions
          askJoinQuestions
          hideExtensionData
          locationDisplayPrecision
          publicMemberDirectory
          showSuggestedSkills
        }
      }
    }
    upcomingEvents: posts(afterTime: "${new Date().toISOString()}", filter: "event", sortBy: "start_time", order: "asc", first: 4) {
      hasMore
      items {
        id
        title
        startTime
        endTime
        location
        members {
          items {
            id
            avatarUrl
            name
          }
        }
      }
    }
    widgets {
      items {
        id
        name
        isVisible
        order
        context
        settings {
          text
          title
        }
      }
    }
    ${groupTopicsQueryFragment}
  }`
}
