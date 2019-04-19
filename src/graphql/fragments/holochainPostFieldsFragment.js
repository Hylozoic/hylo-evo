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
