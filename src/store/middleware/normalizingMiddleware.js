/* eslint-disable no-unused-vars */
import {
  castArray, each, isObject, reduce, uniqWith, snakeCase, toPairs, includes, compact,
  flatten, values, keys, find
} from 'lodash/fp'

import { FETCH_CURRENT_USER, FETCH_POSTS, FETCH_FEED_ITEMS } from '../constants'
import { allRelations } from '../models'

const relations = allRelations()
// TODO: these two might be better off in models/index.js
const flattenedRelations = values(relations).reduce((acc, model) => {
  each(key => { acc[key] = model[key] }, keys(model))
  return acc
}, {})
const relationKeys = keys(flattenedRelations)

export default function normalizingMiddleware ({ dispatch }) {
  return next => action => {
    if (action && action.type) {
      const { type, payload } = action
      switch (type) {
        case FETCH_FEED_ITEMS:
        case FETCH_CURRENT_USER:
        case FETCH_POSTS:
          const actions = collectActions('data', payload.data)
          each(dispatch)(actions)
          break
      }
    }
    return next(action)
  }
}

function collectActions (key, node, actions = []) {
  if (!node) return actions
  const reduceWithKey = reduce.convert({ cap: false })

  var thisAction = null
  var children = []

  if (Array.isArray(node)) {
    children = node.map(child => [key, child])
  } else if (!!node && typeof node === 'object') {
    thisAction = makeAction(key, node)
    children = toPairs(node)
  }

  const newActions = reduceWithKey((actions, [key, val]) => {
    return collectActions(key, val, actions)
  }, [thisAction, ...actions])(children)

  return compact(newActions)
}

function makeAction (key, node) {
  const relation = flattenedRelations[key]
  if (relation) {
    const rtype = relation.relationType
    const type = `ADD_${snakeCase(rtype).toUpperCase()}`
    const payload = normalize(node, rtype)
    return {type, payload}
  } else {
    return null
  }
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
