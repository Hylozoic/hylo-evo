import { BLOCK_USER, UNBLOCK_USER } from '../constants'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import resetStore from '../actions/resetStore'

export default function userBlockingMiddleware (store) {
  return next => action => {
    if (action.type === BLOCK_USER || action.type === UNBLOCK_USER) {
      store.dispatch(resetStore())
      store.dispatch(fetchForCurrentUser())
    }
    return next(action)
  }
}
