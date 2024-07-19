import fetch from 'isomorphic-fetch'
import gql from 'graphql-tag'
import { print } from 'graphql/language/printer'

export const HYLO_GRAPHQL_ENDPOINT_PATH = '/noo/graphql'

export function stringToGraphql (graphqlString) {
  return (typeof graphqlString === 'string' || graphqlString instanceof String)
    ? gql(graphqlString)
    : graphqlString
}

export function graphqlToString (unknownGraphql) {
  // Enables blended use of strings and gql tags for graphql queries
  return (typeof unknownGraphql === 'object' && !(unknownGraphql instanceof String))
    ? print(unknownGraphql)
    : unknownGraphql
}

export function getHyloAPIEndpointURL () {
  return typeof window === 'undefined'
    ? `${process.env.API_HOST}${HYLO_GRAPHQL_ENDPOINT_PATH}`
    : `${window.location.origin}${HYLO_GRAPHQL_ENDPOINT_PATH}`
}

// For directly querying our API outside of the Redux store.
// Currently only used in the WebView HyloEditor
export async function queryHyloAPI ({ query: unknownGraphql, variables }) {
  const params = { query: graphqlToString(unknownGraphql), variables }
  const response = await fetch(getHyloAPIEndpointURL(), {
    body: JSON.stringify(params),
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  if (response.status === 200) {
    return response.json()
  } else {
    const { status, statusText, url } = response
    const body = await response.text()
    const error = new Error(body)

    error.response = { status, statusText, url, body }

    throw error
  }
}
