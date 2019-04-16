import { get } from 'lodash/fp'

export default function holochainGraphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    const holochainAPI = get('holochainAPI', meta)

    if (!holochainAPI || !graphql) return next(action)

    const { query, variables } = graphql
    const [instance, zome, func] = process.env.HOLO_CHAT_GRAPHQL_PATH.split('/')

    const then = payload => {
      if (!payload) Promise.reject(new Error('No result from holochainAPI'))

      const resultJSON = JSON.parse(payload)

      if (resultJSON.Err) return Promise.reject(resultJSON.Err)

      // TODO: is there a way to avoid this second JSON.parse?
      if (resultJSON.Ok) return { data: JSON.parse(resultJSON.Ok) }

      return {}
    }

    return next({
      type,
      meta: {
        ...meta,
        graphql: { query, variables },
        then
      },
      payload: {
        holochainApi: {
          instance,
          zome,
          func,
          params: { query, variables },
          method: 'POST'
        }
      }
    })
  }
}
