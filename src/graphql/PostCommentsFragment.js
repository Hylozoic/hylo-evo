import gql from 'graphql-tag'
import CommentFieldsFragment from 'graphql/CommentFieldsFragment'

export default gql`
  fragment PostCommentsFragment on Post {
    comments(first: 10, order: "desc") @include(if: $withComments) {
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
  ${CommentFieldsFragment}
`
