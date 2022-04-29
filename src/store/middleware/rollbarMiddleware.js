import rollbar from 'client/rollbar'
import { get } from 'lodash/fp'

export default function rollbarMiddleware (store) {
  return next => action => {
    const { error, type, payload } = action
    if (error) {
      let errMsg = `action error for ${type}`
      const serverMessage = get('response.body', payload)
      if (serverMessage) errMsg += `: ${serverMessage}`
      rollbar.error(errMsg, { action: JSON.parse(safeStringify(action)) })
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
