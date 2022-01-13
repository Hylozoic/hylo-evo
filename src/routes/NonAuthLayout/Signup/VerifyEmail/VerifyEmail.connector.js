import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { verifyEmail } from '../Signup.store'

export function mapStateToProps (state, props) {
  const email = getQuerystringParam('email', state, props)
  return {
    error: getLoginError(state),
    email
  }
}

export const mapDispatchToProps = {
  push,
  verifyEmail
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    verifyEmail: (email, code) => {
      dispatchProps.verifyEmail(email, code).then(
        () => { dispatchProps.push('/signup/finish') },
        (e) => { /* error is added to the state by login reducer but we need to catch it here too */ }
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
