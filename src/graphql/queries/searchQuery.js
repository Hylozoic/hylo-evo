import getPostFieldsFragment from '../fragments/getPostFieldsFragment'

export default
`query ($search: String, $type: String, $offset: Int) {
  search(term: $search, first: 10, type: $type, offset: $offset) {
    total
    hasMore
    items {
      id
      content {
        __typename
        ... on Person {
          id
          name
          location
          avatarUrl
          skills {
            items {
              id
              name
            }
          }
        }
        ... on Post {
          ${getPostFieldsFragment(false)}
        }
        ... on Comment {
          id
          text
          createdAt
          creator {
            id
            name
            avatarUrl
          }
          post {
            ${getPostFieldsFragment(false)}
          }
          attachments {
            id
            url
            type
          }
        }
      }
    }
  }
}`
