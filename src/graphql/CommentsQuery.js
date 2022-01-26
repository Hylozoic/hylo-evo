import gql from 'graphql-tag'
import CommentFieldsFragment from 'graphql/CommentFieldsFragment'

export default gql`
  query CommentsQuery($id: ID, $cursor: ID) {
    post(id: $id) {
      id
      comments(first: 10, cursor: $cursor, order: "desc") {
        items {
          ...CommentFieldsFragment
          childComments(first: 4, order: "desc") {
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
        total
        hasMore
      }
    }
  }
  ${CommentFieldsFragment}
`
