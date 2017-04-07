import {
  compact, each, groupBy, keys, mapValues, reduce, snakeCase, toPairs, values
} from 'lodash/fp'
import { merge } from 'lodash'

import { FETCH_CURRENT_USER, FETCH_POSTS } from '../constants'
import { allRelations } from '../models'

const relations = allRelations()
// TODO: these two might be better off in models/index.js
const flattenedRelations = values(relations).reduce((acc, model) => {
  each(key => { acc[key] = model[key] }, keys(model))
  return acc
}, {})

export default function normalizingMiddleware ({ dispatch }) {
  return next => action => {
    if (action && action.type) {
      const { type, payload } = action
      switch (type) {
        case FETCH_CURRENT_USER:
        case FETCH_POSTS:
          const actions = collectActions('data', payload.data)

          each(dispatch, actions)
          break
      }
    }
    return next(action)
  }
}

export function collectActions (key, node, actions = [], recursing = false) {
  if (!node) return actions

  var thisAction = null
  var children = []

  if (Array.isArray(node)) {
    children = node.map(child => [key, child])
  } else if (!!node && typeof node === 'object') {
    thisAction = makeAction(key, node)
    children = toPairs(node)
  }

  const newActions = reduce(
    (actions, [key, val]) => collectActions(key, val, actions, true),
    thisAction ? [thisAction].concat(actions) : actions
  )(children)

  return recursing ? newActions : mergeDuplicates(newActions)
}

function mergeDuplicates (actions) {
  // first group actions by "action key", which is the same for actions related
  // to the same object
  const groups = groupBy(actionKey, actions)
  const merged = mapValues(actions => merge({}, ...actions), groups)

  // now preserve the original order of actions
  const actionKeys = actions.map(actionKey)
  // skip an action if it is not the first one in the list to match its key
  return compact(actions.map((action, index) => {
    const id = actionKey(action)
    return actionKeys.indexOf(id) === index ? merged[id] : null
  }))
}

function actionKey ({ type, payload: { id } }) {
  return type + ' ' + id
}

function makeAction (key, node) {
  const relation = flattenedRelations[key]
  if (!relation) return null

  const rtype = relation.relationType
  const type = `ADD_${snakeCase(rtype).toUpperCase()}`
  const payload = normalize(node, rtype)
  return {type, payload}
}

function normalize (entity, relationType) {
  const reduceWithKey = reduce.convert({ cap: false })
  const relation = relations[relationType]
  return reduceWithKey(
    (transformed, val, key) => {
      if (relation.hasOwnProperty(key)) {
        transformed[key] = relation[key].transform(val)
      } else {
        transformed[key] = val
      }
      return transformed
    },
    {}
  )(entity)
}
