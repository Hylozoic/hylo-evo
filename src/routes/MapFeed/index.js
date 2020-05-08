import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './MapFeed'
import holochainConnector from './MapFeed.holochain.connector'
import connector from './MapFeed.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
