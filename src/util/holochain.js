export const HOLOCHAIN_MODE_SUBDOMAIN = 'holo'

export const HOLOCHAIN_ACTIVE = typeof window !== 'undefined' &&
  window.location.host.split('.')[0] === HOLOCHAIN_MODE_SUBDOMAIN

export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'
