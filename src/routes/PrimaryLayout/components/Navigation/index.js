import component from './Navigation'
import connector from './Navigation.connector'
import { withRouter } from 'react-router-dom'
export default withRouter(connector(component))
