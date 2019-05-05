import { ApolloLink, Observable } from 'apollo-link'
import { Client } from 'rpc-websockets'
import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'
import { createCallObjectWithParams } from 'util/holochain'

export class HolochainWebSocketLink extends ApolloLink {
  constructor (paramsOrClient) {
    super()

    this.holochainSocket = new Client(paramsOrClient.uri)
    this.holochainSocket.on('open', () => console.log('🎉 Successfully connected to Holochain!'))
  }

  request (operation) {
    return new Observable(async observer => {
      try {
        const query = graphqlToString(operation.query)
        const variables = operation.variables
        const callObject = createCallObjectWithParams({
          query,
          variables
        })
        const rawResult = await this.holochainSocket.call('call', callObject)
        const jsonResult = JSON.parse(rawResult)
        const error = get('Err', jsonResult)
        const ok = get('Ok', jsonResult)

        if (error) {
          throw new Error(`error: ${JSON.parse(error)}`)
        }

        if (!ok) {
          throw new Error(`response returned Ok with an unexpected result: ${jsonResult}}`)
        }

        const result = JSON.parse(ok)

        if (process.env.NODE_ENV === 'development') {
          console.log('👍 Holochain graphql operation complete: ', { result, query, variables })
        }

        observer.next({ data: result })
        observer.complete()
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.log('👎 Holochain graphql operation error -- ', error, operation)

        console.log('!! error retrieving in holochain', error)
        observer.error(error)
      }
    })
  }
}

export default HolochainWebSocketLink
