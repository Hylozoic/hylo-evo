import { FETCH_POSTS, ADD_POST } from '../constants'

export default function parserMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action
      switch(type) {
        case FETCH_POSTS:
          addPosts(dispatch, payload)
          break;
      }
    }
    return next(action)
  }
}

export function addPosts (dispatch, payload) {
  if (!payload.me || !payload.me.posts || payload.me.posts.length === 0) return
  payload.me.posts.forEach(post => dispatch({ type: ADD_POST, payload: post }))
}
