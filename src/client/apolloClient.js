import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import HolochainWebSocketLink from './HolochainWebSocketLink'
import { RetryLink } from 'apollo-link-retry'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HttpLink } from 'apollo-link-http'
// import { split } from 'apollo-link'
// import { get } from 'lodash/fp'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

// * FOR USING APOLLO FOR BOTH HYLO-NODE API AND HOLOCHAIN CLIENT
// const link = split(
//   operation => HOLOCHAIN_ACTIVE,
//   new HolochainWebSocketLink({
//     uri: process.env.HOLOCHAIN_WEBSOCKET_URI
//   }),
//   new HttpLink({
//     uri: 'http://localhost:9000/noo/graphql'
//   })
// )

// * HOW TO CREATE LOCAL RESOLVERS
// https://www.apollographql.com/docs/link/links/state
// const resolvers = {
//   Mutation: {},
//   Query: {}
// }

const link = ApolloLink.from([
  new RetryLink(),
  new HolochainWebSocketLink({
    uri: process.env.HOLOCHAIN_WEBSOCKET_URI,
    active: HOLOCHAIN_ACTIVE
  })
])

const apolloClient = new ApolloClient({
  link,
  // resolvers
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export default apolloClient
