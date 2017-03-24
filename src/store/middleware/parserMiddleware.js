import { FETCH_POSTS, ADD_POST } from '../constants'
import postParser from '../parsers/postParser'

export default function parserMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
          addPosts(dispatch, payload)
          break
      }
    }
    return next(action)
  }
}

function addPosts (dispatch, payload) {
  if (!payload.me || !payload.me.posts || payload.me.posts.length === 0) return

  const { isValid, parse } = postParser
  payload.me.posts.forEach(post => {
    if (!isValid(post)) return
      
    // TODO: handle parsing errors?
    dispatch({
      type: ADD_POST,
      payload: parse(post)
    })
  })
}

