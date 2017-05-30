import { EXTRACT_MODEL } from 'store/constants'
import { isPromise } from 'util/index'

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

    var modelName, newPayload, append

    if (typeof extractModel === 'string') {
      // shorthand syntax: payload.data must have exactly one child, and the
      // value of extractModel is the model name
      if (keys.length !== 1) {
        throw new Error(`Bad data for ${action.type}: payload.data should have exactly one child`)
      }

      newPayload = payload.data[keys[0]]
      modelName = extractModel
      append = true
    } else {
      newPayload = extractModel.getRoot(payload.data)
      modelName = extractModel.modelName
      append = extractModel.append
    }

    store.dispatch({
      type: EXTRACT_MODEL,
      payload: newPayload,
      meta: {
        modelName,
        append
      }
    })

    return next(action)
  }
}
