export default function graphqlMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    if (!graphql) return next(action)

    const { query, variables } = graphql
    return next({
      type,
      meta,
      payload: {
        api: {
          path: '/noo/graphql',
          params: {query, variables},
          method: 'POST'
        }
      }
    })
  }
}
