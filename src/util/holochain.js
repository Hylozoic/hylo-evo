export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]
export const HOLOCHAIN_ACTIVE = process.env.HOLOCHAIN_BUILD || (
  typeof window !== 'undefined' &&
    HOLOCHAIN_SUBDOMAINS.some(subdomain => window.location.host.split('.')[0] === subdomain)
)
export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'
export const HOLOCHAIN_POLL_INTERVAL_SLOW = 30000
export const HOLOCHAIN_POLL_INTERVAL_FAST = 10000

export function getHolochainWebsocketURI () {
  return process.env.HOLOCHAIN_WEBSOCKET_URI
}

export function createZomeCallObjectByPathAndArgs (path, args) {
  // Paths are in this format: `instance_id/zome/function`
  const callParams = path.split('/')

  return {
    'instance_id': callParams[0],
    'zome': callParams[1],
    'function': callParams[2],
    args
  }
}

export function createGraphqlZomeCallObjectWithArgs (args) {
  return createZomeCallObjectByPathAndArgs(process.env.HOLOCHAIN_GRAPHQL_PATH, args)
}

export function currentDateString () {
  return new Date().toISOString()
}
