import NavigationHandler from './NavigationHandler'
import connector from './NavigationHandler.connector'
import { withRouter } from 'react-router'

export default connector(withRouter(NavigationHandler))
