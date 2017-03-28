import { connect } from 'react-redux'
import { checkLogin, login } from './actions'
export default connect(null, {checkLogin, login})
