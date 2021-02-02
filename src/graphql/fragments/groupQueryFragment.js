import groupTopicsQueryFragment from 'graphql/fragments/groupTopicsQueryFragment'

export default
`group(slug: $slug, updateLastViewed: $updateLastViewed) {
  id
  accessibility
  avatarUrl
  bannerUrl
  description
  name
  settings {
    allowGroupInvites
    publicMemberDirectory
  }
  slug
  visibility
  parentGroups {
    items {
      id
      slug
      name
      avatarUrl
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
