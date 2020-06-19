const communityFieldsFragment = () => `
  id
  name
  slug
  description
  avatarUrl
  isPublic
  isAutoJoinable
  publicMemberDirectory
  network {
    id
    slug
    name
    avatarUrl
    communities(first: 300) {
      items {
        id
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
  }`

export default communityFieldsFragment
