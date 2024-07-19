import { graphqlToString } from 'util/graphql'

export default function graphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action

    if (!graphql) return next(action)

    const { query: unknownGraphql, variables = {} } = graphql
    const query = graphqlToString(unknownGraphql)
    const path = '/noo/graphql'
    const then = async payload => {
      if (payload.errors) return Promise.reject(payload.errors[0])

      // Helper function for getting the results of the operation:
      // e.g. `payload.getData()` vs `payload.data.me` for a query
      // or `payload.data.myMutationName` for a mutation.
      const getData = () => {
        const dataRootKey = payload?.data && Object.keys(payload.data)[0]

        if (dataRootKey) {
          return payload.data[dataRootKey]
        }
      }
      const results = {
        ...payload,
        getData
      }

      // Enable `meta.then` continuation for this middleware
      return meta?.then
        ? meta.then(results)
        : results
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
