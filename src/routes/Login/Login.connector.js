import { connect } from 'react-redux'
import pickLoginError from 'store/selectors/pickLoginError'
import { checkLogin, login, loginWithService } from './Login.store'
import { push } from 'react-router-redux'

export default connect(pickLoginError, {
  checkLogin, login, loginWithService, navigate: push
})
