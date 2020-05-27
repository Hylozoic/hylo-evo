import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './MapExplorer'
import holochainConnector from './MapExplorer.holochain.connector'
import connector from './MapExplorer.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
