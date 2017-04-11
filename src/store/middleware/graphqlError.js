export default function graphqlErrorMiddleware (store) {
  return next => action => {
    const { meta, payload } = action
    if (!meta || !meta.graphql || !payload || !payload.errors) {
      return next(action)
    }

    return next({
      ...action,
      error: payload.errors
    })
  }
}
