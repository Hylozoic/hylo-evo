import ThreadList from './ThreadList'
import connector from './ThreadList.connector'
import { withRouter } from 'react-router-dom'
export default withRouter(connector(ThreadList))
