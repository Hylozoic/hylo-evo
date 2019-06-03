import { ApolloClient } from 'apollo-client'
// import { ApolloLink } from 'apollo-link'
// import HolochainWebSocketLink from './HolochainWebSocketLink'
import { SchemaLink } from 'apollo-link-schema'
// import { RetryLink } from 'apollo-link-retry'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import schema, { /* resolvers */ } from '../graphql-server'
// import typeDefs from 'graphql-server/oldSchema.graphql'

// const link = ApolloLink.from([
//   new RetryLink(),
//   new HolochainWebSocketLink({
//     // * Ignore our hardcoded URI unless a Holochain build
//     //   as when the UI is served from a hApp the URI is inferred
//     uri: process.env.HOLOCHAIN_BUILD
//       ? null
//       : process.env.HOLOCHAIN_WEBSOCKET_URI,
//     logging: HOLOCHAIN_ACTIVE,
//     active: HOLOCHAIN_ACTIVE
//   })
// ])

const link = new SchemaLink({ schema })
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
  // resolvers,
  // typeDefs
})

export default apolloClient

// * FOR USING APOLLO FOR BOTH HYLO-NODE API AND HOLOCHAIN CLIENT
// import { HttpLink } from 'apollo-link-http'
// import { split } from 'apollo-link'
// import { get } from 'lodash/fp'
// const link = split(
//   operation => HOLOCHAIN_ACTIVE,
//   new HolochainWebSocketLink({
//     uri: process.env.HOLOCHAIN_WEBSOCKET_URI
//   }),
//   new HttpLink({
//     uri: 'http://localhost:9000/noo/graphql'
//   })
// )
