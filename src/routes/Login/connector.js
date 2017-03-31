import { connect } from 'react-redux'
import { checkLogin, login, pickError } from './store'

export default connect(pickError, {checkLogin, login})
