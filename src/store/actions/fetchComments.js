import { FETCH_COMMENTS } from 'store/constants'
import { get } from 'lodash/fp'
import CommentsQuery from 'graphql/CommentsQuery'

export default function fetchComments (id, opts = {}) {
  const { cursor } = opts

  return {
    type: FETCH_COMMENTS,
    graphql: {
      query: CommentsQuery,
      variables: {
        id,
        cursor
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getItems: get('payload.data.post.comments')
      }
    }
  }
}
