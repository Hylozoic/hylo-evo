import { connect } from 'react-redux'
import { resetPassword } from './PasswordReset.store.js'

export const mapDispatchToProps = {
  resetPassword
}

export default connect(null, mapDispatchToProps)
