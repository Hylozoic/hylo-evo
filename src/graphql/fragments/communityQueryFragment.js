import communityTopicsQueryFragment from 'graphql/fragments/communityTopicsQueryFragment'

export default
`community(slug: $slug, updateLastViewed: $updateLastViewed) {
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
  ${communityTopicsQueryFragment}
}`
