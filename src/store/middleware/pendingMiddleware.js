import { isPromise } from 'util/index'

export default function pendingMiddleware (store) {
  return next => action => {
    const { type, payload } = action

    if (isPromise(payload)) {
      store.dispatch({ ...action, type: type + '_PENDING', payload: null })
    }

    return next(action)
  }
}
