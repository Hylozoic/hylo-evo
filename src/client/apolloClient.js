import { ApolloClient } from 'apollo-client'
import HolochainWebSocketLink from './HolochainWebSocketLink'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { HttpLink } from 'apollo-link-http'
// import { split } from 'apollo-link'
// import { get } from 'lodash/fp'
// import { HOLOCHAIN_ACTIVE } from 'util/holochain'

// const link = split(
//   operation => HOLOCHAIN_ACTIVE,
//   new HolochainWebSocketLink({
//     uri: process.env.HOLO_CHAT_API_HOST
//   }),
//   new HttpLink({
//     uri: 'http://localhost:9000/noo/graphql'
//   })
// )

const apolloClient = new ApolloClient({
  link: new HolochainWebSocketLink({
    uri: process.env.HOLO_CHAT_API_HOST
  }),
  cache: new InMemoryCache()
})

export default apolloClient
