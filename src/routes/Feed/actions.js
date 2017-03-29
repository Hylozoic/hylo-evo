import { FETCH_POSTS } from 'store/constants'

export function fetchPosts (id, opts = {}) {
  return {
    type: FETCH_POSTS,
    payload: {
      api: {method: 'GET', path: `/noo/community/${id}/posts`}
    }
  }
}
