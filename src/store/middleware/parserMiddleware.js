import { FETCH_POSTS, ADD_POST } from '../constants'

export default function parserMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      switch(action.type) {
        case FETCH_POSTS:
          dispatch({ type: ADD_POST })
      }
    }
    return next(action)
  }
}
