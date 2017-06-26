import Rollbar from 'client/rollbar'
import { get } from 'lodash'

export default function errorMiddleware () {
  return store => next => action => {
    if (action.error) {
      let errMsg = `Redux Action Error in '${action.type}': ${get(action, 'payload[0].message')}`
      if (process.env.NODE_ENV === 'production') {
        Rollbar.error(errMsg, {
          action: decycle(action),
          state: decycle(store.getState())
        })
      } else {
        console.error(errMsg, action)
      }
    }
    return next(action)
  }
}

const decycle = (obj) => {
  let cache = []

  const stringified = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return
      }
      cache.push(value)
    }
    return value
  })
  cache = null

  return stringified
}
