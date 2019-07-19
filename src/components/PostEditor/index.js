import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './PostEditor'
import holochainConnector from './PostEditor.holochain.connector'
import connector from './PostEditor.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
