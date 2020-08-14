import debounce from 'lodash/fp/debounce'

export const DEFAULT_DEBOUNCE_DELAY = 250

export const debounced = debounce(DEFAULT_DEBOUNCE_DELAY, (debouncedFun, params) => debouncedFun(params))

export default debounced
