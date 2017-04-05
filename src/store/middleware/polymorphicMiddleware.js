import { mapValues, map, omit } from 'lodash/fp'

export default function polymorphicMiddleware (store) {
  return next => action => {
    return next({
      ...action,
      payload: transformPolymorph(action.payload)
    })
  }
}

const transformPolymorph = node => {
  if (!node) return node
  if (typeof node !== 'object') return node
  if (node.type && node.content) {
    // Assumes NO nested polymorphic objects
    return {
      ...omit('content', node),
      [node.type]: node.content,
      // TODO: temporary hack until feeditem has it's own id
      id: node.id || `${node.type}_${node.content.id}`
    }
  } else if (Array.isArray(node)) {
    return map(transformPolymorph, node)
  } else {
    return mapValues(transformPolymorph, node)
  }
}
