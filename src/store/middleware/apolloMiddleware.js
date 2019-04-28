import { get } from 'lodash/fp'
import apolloClient from 'client/apolloClient'
import { LOGOUT } from 'store/constants'
import { stringToGraphql } from 'util/graphql'

export default function apolloMiddleware (store) {
  return next => action => {
    const { type, meta, graphql } = action
    let promise
    const apollo = get('apollo', meta)

    // TODO: To handle this and BLOCK_USER with local resolver
    if (type === LOGOUT) {
      apolloClient.resetStore()

      return next(action)
    }

    if (!apollo || !graphql) return next(action)

    const { query: unknownGraphql, variables } = graphql

    const parsedGraphql = stringToGraphql(unknownGraphql)

    const operation = get('definitions[0].operation', parsedGraphql)
    // const queryName = get('definitions[0].selectionSet.selections[0].name.value', parsedGraphql)
    // console.log("TCL: apolloMiddleware -> optimisticResponse", get('apolloOptimistic', meta), operation)

    switch (operation) {
      case 'mutation':
        const update = get('update', apollo)
        const optimisticResponse = get('optimisticResponse', apollo)

        promise = apolloClient.mutate({
          mutation: parsedGraphql,
          variables,
          optimisticResponse,
          update
        })
        break
      case 'query':
        promise = apolloClient.query({
          query: parsedGraphql,
          variables
        })
        break
    }

    if (meta && meta.then) {
      promise = promise.then(meta.then)
    }

    return next({ ...action, payload: promise })
  }
}
