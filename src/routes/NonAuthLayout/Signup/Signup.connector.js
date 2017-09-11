import { connect } from 'react-redux'
import pickLoginError from 'store/selectors/pickLoginError'
import { signup } from './Signup.store'

export const mapDispatchToProps = { signup }

export default connect(pickLoginError, mapDispatchToProps)
