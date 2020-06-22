const communityFieldsFragment = withTopics => `
  id
  name
  slug
  description
  avatarUrl
  bannerUrl
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
  }
  ${withTopics ? `communityTopics(first: 8, order: "desc") {
    items {
      id
      postsTotal
      topic {
        id
        name
      }
    }
    total
    hasMore
  }` : ''}`

export default communityFieldsFragment
