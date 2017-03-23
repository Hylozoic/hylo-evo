import { SEND_GRAPHQL_QUERY } from '../constants'

export function sendGraphqlQuery (query, opts) {
  const { variables, addDataToStore, subject, id } = opts
  return {
    type: SEND_GRAPHQL_QUERY,
    payload: {
      api: true,
      path: '/noo/graphql',
      params: {query, variables},
      method: 'POST'
    },
    // // subject and id are provided so reducers know what to do
    // meta: {
    //   subject,
    //   id,
    //   addDataToStore,
    //   then: resp => resp.data
    // }
  }
}
