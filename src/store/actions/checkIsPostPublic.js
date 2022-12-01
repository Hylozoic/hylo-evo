import gql from 'graphql-tag'

export default function checkIsPostPublic (postId) {
  return {
    type: 'IS_POST_PUBLIC',
    graphql: {
      query: gql`
        query CheckIsPostPublic ($id: ID) {
          post (id: $id) {
            id
          }
        }
      `,
      variables: { id: postId }
    },
    meta: { extractModel: 'Post' }
  }
}
