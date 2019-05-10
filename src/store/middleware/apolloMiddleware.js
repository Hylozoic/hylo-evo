import { get, omit } from 'lodash/fp'
import apolloClient from 'client/apolloClient'
import { LOGOUT, RESET_STORE } from 'store/constants'

/*

  * Make calls to Apollo Client

  'apollo' key on action is simply a passthrough of options to current instance of Apollo client
  with the added feature of being able simply pass a 'graphql' key which can infer and the correct
  operation:

  https://www.apollographql.com/docs/react/api/apollo-client

  Note: currently requires valid parsed graphql (i.e. a graphql file or gql`` tagged operation)

  * Example usage

  Dispatch this:

  callApollo({
    query: MyQuery,
    // * alternatively:
    // mutation: MyMutation,
    // graphql: MyQueryOrMutation,
    ...apolloClientCallOptions
  })

  The action:

  function callApollo (apollo) {
    return {
      type: CALL_APOLLO,
      apollo
    }
  }

*/

export default function apolloMiddleware (store) {
  return next => action => {
    const { type, apollo, meta } = action

    // TODO: Handle LOGOUT and BLOCK_USER (with a local resolver)
    if (type === LOGOUT || type === RESET_STORE) {
      apolloClient.resetStore()

      return next(action)
    }

    if (!apollo) return next(action)

    const { graphql, query, mutation } = apollo
    const operation = graphql || query || mutation
    const operationType = get('definitions[0].operation', operation)
    const apolloCall = {
      [operationType]: operation,
      ...omit([operationType, 'graphql'], apollo)
    }
    let nextPayload

    switch (operationType) {
      case 'mutation':
        nextPayload = apolloClient.mutate(apolloCall)
        break
      case 'query':
        nextPayload = apolloClient.query(apolloCall)
        break
    }

    // Maintain support for the promise middleware
    if (meta && meta.then) {
      nextPayload = nextPayload.then(meta.then)
    }

    return next({ ...action, payload: nextPayload })
  }
}
