import { get } from 'lodash/fp'
import {
  FETCH_POST,
  FETCH_COMMENTS
} from 'store/constants'
import holochainFetchPostQuery from 'graphql/queries/holochainFetchPostQuery'

export default function holochainFetchPost (id, query = holochainFetchPostQuery) {
  return {
    type: FETCH_POST,
    graphql: {
      query,
      variables: {
        id
      }
    },
    meta: {
      holochainAPI: true,
      extractModel: 'Post',
      extractQueryResults: {
        getType: () => FETCH_COMMENTS,
        getItems: get('payload.data.post.comments')
      }
    }
  }
}
