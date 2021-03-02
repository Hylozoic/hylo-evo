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
      description
    }
  }
  parentGroups {
    items {
      id
      slug
      name
      avatarUrl
      description
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
