const holochainPostFieldsFragment = withComments => `
  id
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
  communities {
    id
    name
    slug
  }
  commenters(first: 3) {
    id
    name
    avatarUrl
  }
  commentersTotal
  ${withComments ? `comments(first: 10, order: "desc") {
    items {
      id
      text
      creator {
        id
        name
        avatarUrl
      }
      attachments {
        id
        url
      }
      createdAt
    }
    total
    hasMore
  }` : ''}
`

export default holochainPostFieldsFragment
