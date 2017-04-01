import { castArray, each, isObject, isArray, reduce, uniqBy } from 'lodash/fp'

import { FETCH_POSTS, FETCH_FEEDITEMS } from '../constants'
import { allRelations } from '../models'

const relations = allRelations()

export default function normalizingMiddleware ({dispatch, getState}) {
  return next => action => {
    if (action) {
      const { type, payload } = action

      switch (type) {
        case FETCH_POSTS:
        case FETCH_FEEDITEMS:
          console.log(normalize(payload.data))
          each(normalize(payload.data), dispatch)
          break
      }
    }
    return next(action)
  }
}

function normalize (graphqlResult) {
  const reduceWithKey = reduce.convert({ cap: false })

  const result = reduceWithKey(
    (actions, relation) => [ ...actions, ...getRelation(relation, graphqlResult) ],
    []
  )(relations)
  return uniqBy(a => a.payload.id)(result)
}

function getRelation (relation, resultFragment) {
  let result = []
  const eachWithKey = each.convert({ cap: false })
  eachWithKey((entity, key) => {
    if (relation.hasOwnProperty(key)) {
      const type = `ADD_${relation[key].relationType.toUpperCase()}`
      each(e => {
        result.push({ type, payload: e })
      })(castArray(entity))
    } else if (isObject(entity)) {
      result = [ ...result, ...getRelation(relation, entity) ]
    }
  })(resultFragment)

  return result
}
