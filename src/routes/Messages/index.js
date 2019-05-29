import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './Messages'
import holochainConnector from './Messages.holochain.connector'
import connector from './Messages.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
