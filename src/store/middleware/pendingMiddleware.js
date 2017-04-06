function isPromise (value) {
  return value && typeof value.then === 'function'
}

export default function pendingMiddleware (store) {
  return next => action => {
    const { type, payload } = action
    if (isPromise(payload)) {
      store.dispatch({...action, type: type + '_PENDING', payload: null})
    }
    return next(action)
  }
}
