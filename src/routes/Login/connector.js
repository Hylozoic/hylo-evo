import { connect } from 'react-redux'
import { checkLogin, login, loginWithService, pickError } from './store'

export default connect(pickError, {checkLogin, login, loginWithService})
