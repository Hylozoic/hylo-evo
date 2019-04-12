import { get } from 'lodash/fp'

export default function graphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    const holochainAPI = get('holochainAPI', meta)

    if (holochainAPI || !graphql) return next(action)

    const { query, variables } = graphql

    const path = '/noo/graphql'

    const then = payload => {
      if (payload.errors) return Promise.reject(payload.errors[0])
      return payload
    }

    return next({
      type,
      meta: {
        ...meta,
        graphql: { query, variables },
        then
      },
      payload: {
        api: {
          path,
          params: { query, variables },
          method: 'POST'
        }
      }
    })
  }
}
