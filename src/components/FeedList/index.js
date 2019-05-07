
import { HOLOCHAIN_ACTIVE } from 'util/holochain'
import component from './FeedList'
import holochainConnector from './FeedList.holochain.connector'
import connector from './FeedList.connector'

export default HOLOCHAIN_ACTIVE
  ? holochainConnector(component)
  : connector(component)
