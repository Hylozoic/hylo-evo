import { FETCH_POSTS } from 'store/constants'

export default function postsReducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_POSTS:
      return {
        ...state,
        [payload.id]: payload
      }
    default:
      return state
  }
}
