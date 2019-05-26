import { ApolloLink, Observable } from 'apollo-link'
import { get } from 'lodash/fp'
import { graphqlToString } from 'util/graphql'
import { connect as hcWebClientConnect } from '@holochain/hc-web-client'

const DEFAULT_PARAMS = {
  active: true,
  consoleLogging: false
}

export class HolochainWebSocketLink extends ApolloLink {
  constructor (paramsOrClient = {}) {
    super()

    this.paramsOrClient = Object.assign({}, DEFAULT_PARAMS, paramsOrClient)
  }

  async initOrGetCallGraphqlZome () {
    if (this.callGraphqlZome) return
    try {
      // * Ignore our hardcoded URI unless a Holochain build
      //   as when the UI is served from a hApp the URI is inferred
      const holochainClient = await hcWebClientConnect({
        url: process.env.HOLOCHAIN_BUILD ? null : this.paramsOrClient.uri,
        timeout: 5000,
        wsClient: {
          max_reconnects: 0
        }
      })
      const { callZome } = holochainClient
      const callParams = process.env.HOLOCHAIN_GRAPHQL_PATH.split('/')

      this.callGraphqlZome = callZome(...callParams)
      if (this.paramsOrClient.consoleLogging) {
        console.log('🎉 Successfully connected to Holochain!')
      }
    } catch (error) {
      if (this.paramsOrClient.consoleLogging) {
        console.log('😞 Holochain client connection failed -- ', error.toString())
      }
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

        if (this.paramsOrClient.consoleLogging) {
          console.log('👍 Holochain graphql operation complete: ', { result, query, variables })
        }

        observer.next({ data: result })
        observer.complete()
      } catch (error) {
        if (this.paramsOrClient.consoleLogging) {
          console.log(
            '👎 Holochain graphql operation error -- ', error.toString(),
            {
              graphqlString: graphqlToString(operation.query || operation.mutation),
              operation
            }
          )
        }
        observer.error(error)
      }
    })
  }
}

export default HolochainWebSocketLink
