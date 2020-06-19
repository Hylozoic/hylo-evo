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
  }`

export default communityFieldsFragment
