import { omitBy, includes } from 'lodash'
import qs from 'querystring'
import {
  FETCH_POST
} from '../constants'
// import samplePostApi from 'components/PostCard/samplePostApi.json'

export function fetchPost (id, opts = {}) {
  return {
    type: FETCH_POST,
    // Optionally bypass middleware and load response directly
    // payload: samplePostApi
    payload: {api: true, path: `/noo/post/${id}`}
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
