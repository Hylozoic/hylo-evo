import gql from 'graphql-tag'

export default gql`
  fragment CommentFieldsFragment on Comment {
    id
    text
    creator {
      id
      name
      avatarUrl
    }
    attachments {
      id
      position
      type
      url
    }
    parentComment {
      id
    }
    createdAt
  }
`
