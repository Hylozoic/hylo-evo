import { ApolloLink, Observable } from 'apollo-link'
import { Client } from 'rpc-websockets'
import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'
import { createCallObjectWithParams } from 'util/holochain'

export class HolochainWebSocketLink extends ApolloLink {
  constructor (paramsOrClient) {
    super()

    this.holochainSocket = new Client(paramsOrClient.uri)
    this.holochainSocket.on('open', () => console.log('👍 Success connecting to holochain client'))
  }

  request (operation) {
    return new Observable(async observer => {
      try {
        const holochainRequestAllowed = get('holochain', operation.getContext())
        
        if (!holochainRequestAllowed) return observer.complete()

        const callObject = createCallObjectWithParams({
          query: graphqlToString(operation.query),
          variables: operation.variables
        })
        const rawResult = await this.holochainSocket.call('call', callObject)
        const jsonResult = JSON.parse(rawResult)
        const error = get('Err', jsonResult)
        const ok = get('Ok', jsonResult)

        if (error) {
          throw new Error(`Holochain graphql error: ${JSON.parse(error)}`)
        }

        if (!ok) {
          throw new Error(`Holochain graphql error response returned an unexpected result: ${jsonResult}}`)
        }

        const result = JSON.parse(ok)

        observer.next({ data: result })
        observer.complete()
      } catch (error) {
        console.log('!! error retrieving in holochain', error)
        observer.error(error)
      }
    })
  }
}

export default HolochainWebSocketLink
