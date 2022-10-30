import { debounce } from 'lodash/fp'

// From: https://github.com/lodash/lodash/issues/4815#issuecomment-815866904
export const asyncDebounce = (wait, func) => {
  const debounced = debounce(wait, (resolve, reject, args) => {
    func(...args).then(resolve).catch(reject)
  })

  return (...args) =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args)
    })
}

export default asyncDebounce
