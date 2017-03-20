import { FETCH_POST } from 'store/constants'
import samplePostApi from 'components/PostCard/samplePostApi.json'

export default function postsReducer (state = {}, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case FETCH_POST:
      return Object.assign({}, {
        ...state,
        [payload.id]: payload
      })
    default:
      return state
  }
}
