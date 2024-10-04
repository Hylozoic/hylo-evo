import { get } from 'lodash/fp'
import { isPromise } from 'util/index'
import { SET_STATE } from 'store/constants'

export default function optimisticMiddleware (store) {
  return next => action => {
    const { payload, meta } = action

    if (get('optimistic', meta) && isPromise(payload)) {
      const prevState = store.getState()
      action.payload = action.payload.then(
        result => result,
        error => {
          store.dispatch({ type: SET_STATE, payload: prevState, meta: { error } })
          return Promise.reject(error)
        }
      )
    }

    return next(action)
  }
}
