import { get } from 'lodash/fp'
import {
  FETCH_POST,
  FETCH_COMMENTS
} from 'store/constants'
import PostQuery from 'graphql/queries/PostQuery'

export default function fetchPost (id, query = PostQuery) {
  return {
    type: FETCH_POST,
    graphql: {
      query,
      variables: {
        id
      }
    },
    meta: {
      extractModel: 'Post',
      extractQueryResults: {
        getType: () => FETCH_COMMENTS,
        getItems: get('payload.data.post.comments')
      }
    }
  }
}
