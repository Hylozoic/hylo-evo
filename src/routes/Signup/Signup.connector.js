import { connect } from 'react-redux'
import pickLoginError from 'store/selectors/pickLoginError'
import { signup } from './Signup.store'
import { push } from 'react-router-redux'

export const mapDispatchToProps = {signup, navigate: push}

export default connect(pickLoginError, mapDispatchToProps)
