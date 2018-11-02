import {
  isEmpty,
  intersection,
  castArray,
  keys,
  omitBy,
  isNull
} from 'lodash/fp'

export default function isPendingFor (pendingKeys = [], state) {
  const { pending } = state

  return !isEmpty(
    intersection(
      castArray(pendingKeys),
      keys(omitBy(isNull, pending))))
}
