import { connect } from 'react-redux'
import { checkLogin, login, loginWithService, pickError } from './Login.store'
import { push } from 'react-router-redux'

export default connect(pickError, {
  checkLogin, login, loginWithService, navigate: push
})
