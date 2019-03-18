import { get } from 'lodash/fp'

export default function graphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    if (!graphql) return next(action)

    const { query, variables } = graphql

    const holoChatAPI = get('holoChatAPI', meta)
    const path = holoChatAPI ? process.env.HOLO_CHAT_GRAPHQL_PATH : '/noo/graphql'
    // const params = holoChatAPI ? holochatQueryParams({query, variables}) : {query, variables}
    // TODO: this code could be better encapsulated, maybe as part of the fetchJSON and holoFetchJSON functions
    const then = holoChatAPI
      ? payload => {
        if (!payload) Promise.reject(new Error('No result from holoChatAPI'))
        const resultJSON = JSON.parse(payload)
        if (resultJSON.Err) return Promise.reject(resultJSON.Err)
        // TODO: is there a way to avoid this second JSON.parse?
        if (resultJSON.Ok) return {data: JSON.parse(resultJSON.Ok)}
        return {}
      }
      : payload => {
        if (payload.errors) return Promise.reject(payload.errors[0])
        return payload
      }

    return next({
      type,
      meta: {
        ...meta,
        graphql: {query, variables},
        then
      },
      payload: {
        api: {
          path,
          params: {query, variables},
          method: 'POST'
        }
      }
    })
  }
}