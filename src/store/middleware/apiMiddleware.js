// import fetch from 'isomorphic-fetch'
import { upstreamHost } from '../../config'
import samplePostApi from 'components/PostCard/samplePostApi.json'

export default function apiMiddleware (req) {
  return store => next => action => {
    const { payload, meta } = action
    if (!payload || !payload.api) return next(action)

    const { path, params, method } = payload
    const cookie = req && req.headers.cookie
    let promise = fetchJSON(path, params, {method, cookie})

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({...action, payload: promise})
  }
}

// FIXME: For now disable proxy through window.location.origin
//        and go directly to API host in both client and server modes
// export const HOST = typeof window === 'undefined'
//   ? upstreamHost
//   : window.location.origin
export const HOST = upstreamHost

// FIXME: Temporarily hardcoding the API response to a samplePostApi
//        for testing purposes
export function fetchJSON (path, params, options = {}) {
  return Promise.resolve(samplePostApi)
}
// export function fetchJSON (path, params, options = {}) {
//   const fetchURL = (options.host || HOST) + path
//   const fetchOptions = {
//     method: options.method || 'get',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Cookie': options.cookie
//     },
//     credentials: 'same-origin',
//     body: JSON.stringify(params)
//   }
//   const processResults = (resp) => {
//     let { status, statusText, url } = resp
//     if (status === 200) return resp.json()
//     return resp.text().then(body => {
//       let error = new Error(body)
//       error.response = {status, statusText, url, body}
//       throw error
//     })
//   }
//   return fetch(fetchURL, fetchOptions).then(processResults)
// }
