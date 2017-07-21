const { ROLLBAR_CLIENT_TOKEN } = process.env

export default function errorMiddleware (store) {
  return next => action => {
    if (action.error) {
      let errMsg = `action error for ${action.type}`

      console.error(errMsg, action)

      if (typeof window !== 'undefined' && ROLLBAR_CLIENT_TOKEN) {
        let Rollbar = require('client/rollbar').default
        Rollbar.error(errMsg, {
          action: safeStringify(action),
          state: safeStringify(store.getState())
        })
      }
    }
    return next(action)
  }
}

const safeStringify = (obj) => {
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
