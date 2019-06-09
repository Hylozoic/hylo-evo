import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.graphql'
import resolvers from './resolvers'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
