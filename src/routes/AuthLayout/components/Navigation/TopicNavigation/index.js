import TopicNavigation from './TopicNavigation'
import connector from './TopicNavigation.connector'
import { withRouter } from 'react-router-dom'
export default withRouter(connector(TopicNavigation))
