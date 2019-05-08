import { castArray } from 'lodash'
import ModelExtractor from 'store/reducers/ModelExtractor'

// extract immediately instead of creating new actions
export default function extractModelsFromAction (action, session) {
  getRoots(action).forEach(({ payload, modelName, append }) =>
    ModelExtractor.addAll({ session, root: payload, modelName, append }))
}

export function getRoots (action) {
  const { meta: { extractModel }, payload } = action
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

  return roots
}
