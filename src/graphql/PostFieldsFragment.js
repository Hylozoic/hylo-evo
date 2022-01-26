import gql from 'graphql-tag'
import PostCommentsFragment from 'graphql/PostCommentsFragment'
// TODO: GraphQL - Removing interpolated constant so query will parse
// and to re-consider how we pass such things
// import { INITIAL_SUBCOMMENTS_DISPLAYED } from 'routes/PostDetail/Comments/Comment/Comment'

export default gql`
  fragment PostFieldsFragment on Post {
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
    ...PostCommentsFragment
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
  }
  ${PostCommentsFragment}
`
