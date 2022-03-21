import {
  isEmpty,
  intersection,
  castArray,
  keys,
  omitBy,
  isNull,
  get,
  isFunction
} from 'lodash/fp'

export default function isPendingFor (pendingActionsOrKeys = [], state) {
  const { pending } = state

  const pendingKeys = castArray(pendingActionsOrKeys).map(pendingActionOrKey =>
    isFunction(pendingActionOrKey)
      ? get('type', pendingActionOrKey())
      : pendingActionOrKey
  )
  return !isEmpty(
    intersection(
      pendingKeys,
      keys(omitBy(isNull, pending))))
}
