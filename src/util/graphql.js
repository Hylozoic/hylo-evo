import gql from 'graphql-tag'
import { print } from 'graphql/language/printer'

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
