import { EXTRACT_MODEL } from 'store/constants'
import { isPromise } from 'util/index'
import { castArray } from 'lodash'

export default function extractModelMiddleware (store) {
  return next => action => {
    const { meta, error, payload } = action
    if (error ||
      !meta || !meta.extractModel ||
      !payload || isPromise(payload)) {
      return next(action)
    }

    const { extractModel } = meta
    const keys = Object.keys(payload.data)
    const roots = []

    if (typeof extractModel === 'string') {
      // shorthand syntax: payload.data must have exactly one child, and the
      // value of extractModel is the model name
      if (keys.length !== 1) {
        throw new Error(`Bad data for ${action.type}: payload.data should have exactly one child`)
      }

      roots.push({
        payload: payload.data[keys[0]],
        modelName: extractModel,
        append: true
      })
    } else {
      castArray(extractModel).forEach(config => {
        roots.push({
          payload: config.getRoot(payload.data),
          modelName: config.modelName,
          append: config.append
        })
      })
    }

    roots.forEach(({ payload, modelName, append }) =>
      store.dispatch({type: EXTRACT_MODEL, payload, meta: {modelName, append}}))

    return next(action)
  }
}
