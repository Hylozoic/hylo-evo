import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'

export default function holochainGraphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    const holochainAPI = get('holochainAPI', meta)

    if (!holochainAPI || !graphql) return next(action)

    const { query: unknownGraphql, variables } = graphql
    const query = graphqlToString(unknownGraphql)

    const then = payload => {
      if (!payload) Promise.reject(new Error('No result from holochainAPI'))

      const resultJSON = JSON.parse(payload)

      if (resultJSON.Err) return Promise.reject(resultJSON.Err)

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
          params: { query, variables }
        }
      }
    })
  }
}
