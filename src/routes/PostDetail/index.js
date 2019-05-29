import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './PostDetail'
import holochainConnector from './PostDetail.holochain.connector'
import connector from './PostDetail.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
