import CommunitySidebar from './CommunitySidebar'
import connector from './CommunitySidebar.connector'
import { HOLOCHAIN_ACTIVE } from 'util/holochain'

export default HOLOCHAIN_ACTIVE
  ? null
  : connector(CommunitySidebar)
