import { get } from 'lodash/fp'
import { isPromise } from 'util/index'
import { SET_STATE } from 'store/constants'

export default function optimisticMiddleware (store) {
  return next => action => {
    let { payload, meta } = action
    if (get('optimistic', meta) && isPromise(payload)) {
      const prevState = store.getState()
      action.payload = action.payload.then(
        result => {
          // if (result.errors) {
          //   store.dispatch({type: SET_STATE, payload: prevState})
          //   throw result.errors
          // }
          return result
        },
        error => {
          store.dispatch({type: SET_STATE, payload: prevState})
          throw error
        }
      )
    }
    return next(action)
  }
}
