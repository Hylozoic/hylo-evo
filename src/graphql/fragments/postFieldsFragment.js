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
    commonRoles{
      items {
         name
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
    moderatedGroupMemberships {
      groupId
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
    commonRoles{
      items {
         name
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
    moderatedGroupMemberships {
      groupId
    }
  }
  createdAt
  updatedAt
  isPublic
  fulfilledAt
  startTime
  endTime
  timezone
  donationsLink
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
  myVote
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
