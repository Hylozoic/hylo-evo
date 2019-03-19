import fetch from 'isomorphic-fetch'
import { get } from 'lodash/fp'
import holoFetchJSON from 'util/holoFetchJSON'

export default function apiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method } = payload.api
    const cookie = req && req.headers.cookie
    const holoChatAPI = get('holoChatAPI', meta)

    var promise
    if (holoChatAPI) {
      promise = holoFetchJSON(path, params)
    } else {
      promise = fetchJSON(path, params, {method, cookie, host: getHost()})
    }

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({...action, payload: promise})
  }
}

// TODO: do we ever use API_HOST?
export function getHost () {
  if (typeof window === 'undefined') {
    return process.env.API_HOST
  } else {
    return window.location.origin
  }
}

export function fetchJSON (path, params, options = {}) {
  const fetchURL = (options.host) + path
  const fetchOptions = {
    method: options.method || 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': options.cookie
    },
    credentials: 'same-origin',
    body: JSON.stringify(params)
  }
  const processResults = (resp) => {
    let { status, statusText, url } = resp
    if (status === 200) return resp.json()
    return resp.text().then(body => {
      let error = new Error(body)
      error.response = {status, statusText, url, body}
      throw error
    })
  }
  return fetch(fetchURL, fetchOptions).then(processResults)
}
