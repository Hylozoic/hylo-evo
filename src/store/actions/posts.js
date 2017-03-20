import { omitBy, includes } from 'lodash'
import qs from 'querystring'
import {
  FETCH_POST
} from '../constants'

export function fetchPost (id, opts = {}) {
  // let querystring = opts.minimal ? ''
  //   : cleanAndStringify({comments: 1, votes: 1, children: 1})
  let querystring = ''

  return {
    type: FETCH_POST,
    payload: {api: true, path: `/noo/post/${id}?${querystring}`}
  }
}

export function cleanAndStringify (opts, defaults) {
  return qs.stringify(omitBy(opts, blankOrDefault(defaults)))
}

const commonDefaults = {
  type: ['all+welcome', 'all'],
  sort: 'recent'
}

const blankOrDefault = (defaults = commonDefaults) => (value, key) => {
  let defaultValue = defaults[key]
  return defaultValue === value ||
    (!value && value !== 0) ||
    (Array.isArray(defaultValue) && includes(defaultValue, value))
}
