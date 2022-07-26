import { debounce } from 'lodash/fp'

export default function asyncDebounce (wait, func) {
  const debounced = debounce(wait, (resolve, reject, args) => {
    func(...args).then(resolve).catch(reject)
  })

  return (...args) =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args)
    })
}
