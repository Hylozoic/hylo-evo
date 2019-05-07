import { ApolloClient } from 'apollo-client'
import HolochainWebSocketLink from './HolochainWebSocketLink'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HttpLink } from 'apollo-link-http'
// import { split } from 'apollo-link'
// import { get } from 'lodash/fp'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

// * FOR USING APOLLO FOR BOTH HYLO-NODE API AND HOLOCHAIN CLIENT
// const link = split(
//   operation => HOLOCHAIN_ACTIVE,
//   new HolochainWebSocketLink({
//     uri: process.env.HOLO_CHAT_API_HOST
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

const apolloClient = new ApolloClient({
  link: new HolochainWebSocketLink({
    uri: process.env.HOLO_CHAT_API_HOST,
    active: HOLOCHAIN_ACTIVE
  }),
  cache: new InMemoryCache()
  // resolvers: resolvers
})

export default apolloClient
