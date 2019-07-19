import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './NotificationsDropdown'
import holochainConnector from './NotificationsDropdown.holochain.connector'
import connector from './NotificationsDropdown.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
