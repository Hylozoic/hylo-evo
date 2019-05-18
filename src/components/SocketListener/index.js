import SocketListener from './SocketListener'
import connector from './SocketListener.connector'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

export default HOLOCHAIN_ACTIVE
  ? () => null
  : connector(SocketListener)
