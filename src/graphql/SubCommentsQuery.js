import gql from 'graphql-tag'
import CommentFieldsFragment from 'graphql/CommentFieldsFragment'

export default gql`
  query SubCommentsQuery(
    $id: ID,
    $cursor: ID
  ) {
    comment(id: $id) {
      id
      childComments(first: 10, cursor: $cursor, order: "desc") {
        items {
          ...CommentFieldsFragment
          post {
            id
          }
        }
        total
        hasMore
      }
    }
  }
  ${CommentFieldsFragment}
`
