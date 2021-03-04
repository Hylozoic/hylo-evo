import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

export default
`group(slug: $slug, updateLastViewed: $updateLastViewed) {
  id
  accessibility
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
      avatarUrl
      bannerUrl
      description
      name
      slug
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
      avatarUrl
      bannerUrl
      description
      name
      slug
      settings {
        allowGroupInvites
        askJoinQuestions
        publicMemberDirectory
      }
    }
  }
  memberCount
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
  ${groupTopicsQueryFragment}
}`
