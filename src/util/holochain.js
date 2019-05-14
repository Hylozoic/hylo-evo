export const HOLOCHAIN_SUBDOMAINS = [
  'holo',
  'holochain'
]

export const HOLOCHAIN_ACTIVE = process.env.HOLOCHAIN_BUILD || (
  typeof window !== 'undefined' &&
  HOLOCHAIN_SUBDOMAINS.some(subdomain => window.location.host.split('.')[0] === subdomain)
)

export const HOLOCHAIN_HASH_MATCH = '[a-zA-Z0-9]{46}'

export const HOLOCHAIN_MOCK_AGENT = {
  id: 'robbie',
  name: 'Robbie Carlton',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/11204/avatar/1467755857845_a14145223586391656938.jpeg'
}

export function createCallObjectWithParams (params) {
  const [instance, zome, func] = process.env.HOLO_CHAT_GRAPHQL_PATH.split('/')

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
