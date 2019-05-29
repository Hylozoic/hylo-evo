import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './Comments'
import holochainConnector from './Comments.holochain.connector'
import connector from './Comments.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
