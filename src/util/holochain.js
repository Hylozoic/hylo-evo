export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]

export const HOLOCHAIN_ACTIVE = process.env.HOLOCHAIN_BUILD || (
  typeof window !== 'undefined' &&
  HOLOCHAIN_SUBDOMAINS.some(subdomain => window.location.host.split('.')[0] === subdomain)
)

export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'

export function createCallObjectWithParams (params) {
  const [instance, zome, func] = process.env.HOLOCHAIN_GRAPHQL_PATH.split('/')

  return {
    'instance_id': instance,
    zome,
    'function': func,
    params
  }
}

export function currentDateString () {
  // ? Date vs Time -- Do these return the same thing and should they?
  return new Date().toISOString()
}
