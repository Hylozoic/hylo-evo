import { ApolloClient } from 'apollo-client'
import HolochainWebSocketLink from './HolochainWebSocketLink'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

const link = split(
  () => HOLOCHAIN_ACTIVE,
  new HolochainWebSocketLink({
    uri: process.env.HOLO_CHAT_API_HOST
  }),
  new HttpLink({
    uri: 'http://localhost:9000/noo/graphql'
  })
)
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

export default apolloClient
