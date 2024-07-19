import fetch from 'isomorphic-fetch'

export default function apiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action

    if (!payload || !payload.api) return next(action)

    const { path, params, method } = payload.api
    const cookie = req && req.headers.cookie

    let promise = fetchJSON(path, params, { method, cookie, host: getHost() })

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({ ...action, payload: promise })
  }
}

export function getHost () {
  if (typeof window === 'undefined') {
    return process.env.API_HOST
  } else {
    return window.location.origin
  }
}

export function fetchJSON (path, params, options = {}) {
  const method = options.method ? options.method.toLowerCase() : 'get'
  const fetchURL = (options.host) + path + (method === 'get' && params ? '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&') : '')
  const fetchOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: options.cookie
    },
    credentials: 'same-origin',
    body: method === 'post' ? JSON.stringify(params) : null
  }
  const processResults = (resp) => {
    const { status, statusText, url } = resp
    if (status === 200) return resp.json()
    return resp.text().then(body => {
      const error = new Error(body)
      error.response = { status, statusText, url, body }
      throw error
    })
  }
  return fetch(fetchURL, fetchOptions).then(processResults)
}
