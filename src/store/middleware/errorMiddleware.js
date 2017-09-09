import rollbar from 'client/rollbar'

export default function errorMiddleware (store) {
  return next => action => {
    if (action.error) {
      let errMsg = `action error for ${action.type}`

      if (rollbar) {
        rollbar.error(errMsg, {
          action: JSON.parse(safeStringify(action))
        })
      } else {
        console.error(errMsg, action)
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
