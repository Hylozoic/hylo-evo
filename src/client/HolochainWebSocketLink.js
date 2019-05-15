import { ApolloLink, Observable } from 'apollo-link'
import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'
import { connect as hcWebClientConnect } from '@holochain/hc-web-client'

const DEFAULT_PARAMS = {
  active: true
}

export class HolochainWebSocketLink extends ApolloLink {
  constructor (paramsOrClient = {}) {
    super()

    this.paramsOrClient = Object.assign({}, DEFAULT_PARAMS, paramsOrClient)
  }

  async initOrGetCallGraphqlZome () {
    if (this.callGraphqlZome) return
    try {
      // * Use apollo-retry-link instead of native WS-RPC retries
      //   requires a hc-web-client update to allow passing this
      //   WS-RPC config parameter: `max_reconnects: 0`
      // * Ignore our hardcoded URI unless a Holochain build
      //   as when the UI is served from a hApp the URI is inferred
      const holochainClient = await hcWebClientConnect(
        process.env.HOLOCHAIN_BUILD
          ? null
          : this.paramsOrClient.uri
      )
      const { callZome } = holochainClient
      const callParams = process.env.HOLOCHAIN_GRAPHQL_PATH.split('/')

      this.callGraphqlZome = callZome(...callParams)
      console.log('🎉 Successfully connected to Holochain!')
    } catch (error) {
      console.log('😞 Holochain client connection failed -- ', error.toString())
      throw (error)
    }
  }

  request (operation) {
    return new Observable(async observer => {
      if (!this.paramsOrClient.active) return observer.complete()

      try {
        await this.initOrGetCallGraphqlZome()

        const query = graphqlToString(operation.query)
        const variables = operation.variables
        const rawResult = await this.callGraphqlZome({
          query,
          variables
        })
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
        if (process.env.NODE_ENV === 'development') {
          console.log('👎 Holochain graphql operation error -- ', error.toString(), operation)
        }

        observer.error(error)
      }
    })
  }
}

export default HolochainWebSocketLink
