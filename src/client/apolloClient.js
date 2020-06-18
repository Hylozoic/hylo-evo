import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import apolloLogger from 'apollo-link-logger'
import { InMemoryCache } from 'apollo-cache-inmemory'

const link = ApolloLink.from([
  apolloLogger,
  new HttpLink({
    uri: 'http://localhost:9000/noo/graphql'
  })
])

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export default apolloClient
