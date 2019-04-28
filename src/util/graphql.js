import gql from 'graphql-tag'

export function stringToGraphql (graphqlString) {
  return (typeof graphqlString === 'string' || graphqlString instanceof String)
    ? gql(graphqlString)
    : graphqlString
}

export function graphqlToString (unknownGraphql) {
  // Enables blended use of strings and gql tags for graphql queries
  return (typeof unknownGraphql === 'object' && !(unknownGraphql instanceof String))
    ? unknownGraphql.loc && unknownGraphql.loc.source.body
    : unknownGraphql
}
