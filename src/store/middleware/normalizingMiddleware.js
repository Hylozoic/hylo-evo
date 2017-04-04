import { castArray, each, isObject, reduce, uniqWith } from 'lodash/fp'

import { FETCH_CURRENT_USER, FETCH_POST, FETCH_FEEDITEM } from '../constants'
import { allRelations } from '../models'

const relations = allRelations()

export default function normalizingMiddleware ({ dispatch }) {
  return next => action => {
    if (action && action.type) {
      const { type, payload } = action

      switch (type) {
        case FETCH_CURRENT_USER:
        case FETCH_FEEDITEM:
        case FETCH_POST:
          each(dispatch)(normalize(payload.data))
          break
      }
      return next(action)
    }
  }
}

function normalize (graphqlResult) {
  const reduceWithKey = reduce.convert({ cap: false })

  const result = reduceWithKey(
    (actions, relation) => [ ...actions, ...getRelation(relation, graphqlResult) ],
    []
  )(relations)
  return uniqWith(isUniqueAction)(result)
}

function isUniqueAction (a, b) {
  return a.payload.id === b.payload.id && a.type === b.type
}

function getRelation (relation, resultFragment) {
  let result = []
  const eachWithKey = each.convert({ cap: false })

  eachWithKey((entity, key) => {
    if (relation.hasOwnProperty(key)) {
      const rtype = relation[key].relationType
      const type = `ADD_${rtype.toUpperCase()}`
      each(e => {
        result.push({ type, payload: transform(e, rtype) })
      })(castArray(entity))
    } else if (isObject(entity)) {
      result = [ ...result, ...getRelation(relation, entity) ]
    }
  })(resultFragment)

  return result
}

function transform (entity, relationType) {
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
