import { isEmpty } from 'lodash/fp'

function others (n) {
  if (n < 0) {
    return ''
  } else if (n === 1) {
    return '1 other'
  } else {
    return `${n} others`
  }
}

export function formatNames (names, maxShown) {
  const length = names.length
  const truncatedNames = (maxShown && maxShown < length)
    ? names.slice(0, maxShown).concat([others(length - maxShown)])
    : names

  const last = truncatedNames.pop()
  if (isEmpty(truncatedNames)) {
    return last
  } else {
    return truncatedNames.join(', ') + ` and ${last}`
  }
}
