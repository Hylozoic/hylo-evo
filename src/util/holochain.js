export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'
export const HOLOCHAIN_POLL_INTERVAL_SLOW = 30000
export const HOLOCHAIN_POLL_INTERVAL_FAST = 10000
export const HOLOCHAIN_DEFAULT_COMMUNITY_NAME = 'Hylo Holochain'
export const HOLOCHAIN_DEFAULT_COMMUNITY_SLUG = 'hylo-holochain'
export const HOLOCHAIN_USE_LOCAL_RESOLVERS = true
export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]
export const HOLOCHAIN_ACTIVE = process.env.HOLOCHAIN_BUILD || (
  typeof window !== 'undefined' &&
    HOLOCHAIN_SUBDOMAINS.some(subdomain => window.location.host.split('.')[0] === subdomain)
)

export function getHolochainWebsocketURI () {
  return process.env.HOLOCHAIN_WEBSOCKET_URI
}

export function currentDateString () {
  return new Date().toISOString()
}
