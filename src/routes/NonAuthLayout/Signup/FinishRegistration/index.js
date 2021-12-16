import { withCookies } from 'react-cookie'

import component from './FinishRegistration'
import connector from './FinishRegistration.connector'

export default withCookies(connector(component))
