import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './Feed'
import holochainConnector from './Feed.holochain.connector'
import connector from './Feed.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
