import { connect } from 'react-redux'
import { checkLogin, login, loginWithService, pickError } from './Login.store'

export default connect(pickError, {checkLogin, login, loginWithService})
