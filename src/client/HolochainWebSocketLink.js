import { ApolloLink, Observable, fromError } from 'apollo-link'
import { Client } from 'rpc-websockets'
import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'
import { createCallObjectWithParams } from 'util/holochain'

const DEFAULT_PARAMS = {
  active: true,
  maxReconnects: 100,
  reconnectInterval: 3000
}

export class HolochainWebSocketLink extends ApolloLink {
  constructor (paramsOrClient = {}) {
    super()

    if (paramsOrClient.active) {
      this.paramsOrClient = Object.assign({}, DEFAULT_PARAMS, paramsOrClient)
      this.ready = new Promise((resolve, reject) => {
        this.readyResolve = resolve
      })
      this.holochainSocket = new Client(paramsOrClient.uri, {
        max_reconnects: paramsOrClient.maxReconnects,
        reconnect_interval: paramsOrClient.reconnectInterval
      })
      this.holochainSocket.on('open', () => {
        this.readyResolve()
        console.log('🎉 Successfully connected to Holochain!')
      })
    }
  }

  request (operation) {
    return new Observable(async observer => {
      if (!this.paramsOrClient.active) return observer.complete()
      try {
        await this.ready

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
