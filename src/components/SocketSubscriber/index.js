import connector from './SocketSubscriber.connector'
import component from './SocketSubscriber'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

export default HOLOCHAIN_ACTIVE
  ? () => null
  : connector(component)
