import { connect } from 'react-redux'
import getLoginError from 'store/selectors/getLoginError'
import getMe from 'store/selectors/getMe'
import { register } from '../Signup.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)

  return {
    currentUser,
    error: getLoginError(state)
  }
}

export const mapDispatchToProps = {
  register
}

export default connect(mapStateToProps, mapDispatchToProps)
