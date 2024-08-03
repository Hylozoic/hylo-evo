import { INITIAL_SUBCOMMENTS_DISPLAYED } from 'routes/PostDetail/Comments/Comment/Comment'

// :TODO: clean this up and use proper query fragments?
const CommentFieldsFragment = `
  id
  text
  creator {
    id
    name
    avatarUrl
    groupRoles {
      items {
         name
         emoji
         active
         groupId
         responsibilities {
          items {
            id
            title
            description
          }
         }
       }
     }
    membershipCommonRoles {
      items {
        id
        commonRoleId
        groupId
        userId
      }
    }
  }
  attachments {
    id
    position
    type
    url
  }
  parentComment {
    id
  }
  myReactions {
    emojiFull
    id
  }
  commentReactions {
    emojiFull
    id
    user {
      id
      name
    }
  }
  createdAt
  editedAt
`

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
    groupRoles {
      items {
        id
        name
        emoji
        active
        groupId
        responsibilities {
          items {
            id
            title
            description
          }
        }
      }
    }
    membershipCommonRoles {
      items {
        id
        commonRoleId
        groupId
        userId
      }
    }
  }
  createdAt
  updatedAt
  isAnonymousVote
  isPublic
  fulfilledAt
  startTime
  endTime
  timezone
  donationsLink
  editedAt
  projectManagementLink
  myEventResponse
  commenters(first: 3) {
    id
    name
    avatarUrl
  }
  commentersTotal
  commentsTotal
  ${withComments ? `comments(first: 10, order: "desc") {
    items {
      ${CommentFieldsFragment}
      childComments(first: ${INITIAL_SUBCOMMENTS_DISPLAYED}, order: "desc") {
        items {
          ${CommentFieldsFragment}
          post {
            id
          }
        }
        total
        hasMore
      }
    }
    total
    hasMore
  }` : ''}
  linkPreview {
    description
    id
    imageUrl
    title
    url
  }
  linkPreviewFeatured
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
  peopleReactedTotal
  proposalStatus
  proposalOutcome
  votingMethod
  quorum
  proposalOptions {
    total
    hasMore
    items {
      id
      text
      emoji
    }
  }
  proposalVotes {
      total
      hasMore
      items {
        id
        optionId
        user {
          id
          name
          avatarUrl
        }
      }
  }
  myReactions {
    emojiFull
    id
  }
  postReactions {
    emojiFull
    id
    user {
      id
      name
    }
  }
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
      }
    }
  }
`

export default postFieldsFragment
