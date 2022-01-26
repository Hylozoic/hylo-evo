import { FETCH_CHILD_COMMENTS } from 'store/constants'
import { get } from 'lodash/fp'
import SubCommentsQuery from 'graphql/SubCommentsQuery'

export default function fetchChildComments (id, opts = {}) {
  const { cursor } = opts

  return {
    type: FETCH_CHILD_COMMENTS,
    graphql: {
      query: SubCommentsQuery,
      variables: {
        id,
        cursor
      }
    },
    meta: {
      extractModel: 'Comment',
      extractQueryResults: {
        getItems: get('payload.data.comment.childComments')
      }
    }
  }
}
