export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]

const currentSubdomain = window.location.host.split('.')[0]

export const HOLOCHAIN_ACTIVE = typeof window !== 'undefined' &&
  HOLOCHAIN_SUBDOMAINS.some(subdomain => currentSubdomain === subdomain)

export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'
