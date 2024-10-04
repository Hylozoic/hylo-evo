import { connect } from 'react-redux'
import sendPasswordReset from 'store/actions/sendPasswordReset'

export const mapDispatchToProps = {
  sendPasswordReset
}

export default connect(null, mapDispatchToProps)
