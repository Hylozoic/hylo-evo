import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './MessagesDropdown'
import holochainConnector from './MessagesDropdown.holochain.connector'
import connector from './MessagesDropdown.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
