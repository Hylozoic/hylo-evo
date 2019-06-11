import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './PrimaryLayout'
import holochainConnector from './PrimaryLayout.holochain.connector'
import connector from './PrimaryLayout.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
