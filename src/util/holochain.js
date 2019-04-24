export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]

export const HOLOCHAIN_ACTIVE = typeof window !== 'undefined' &&
  HOLOCHAIN_SUBDOMAINS.some(subdomain => window.location.host.split('.')[0] === subdomain)

export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'
