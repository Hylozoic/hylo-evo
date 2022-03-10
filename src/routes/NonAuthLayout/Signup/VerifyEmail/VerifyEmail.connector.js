import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { verifyEmail } from '../Signup.store'

export function mapStateToProps (state, props) {
  const email = getQuerystringParam('email', state, props)
  const token = getQuerystringParam('token', state, props)

  return {
    error: getLoginError(state),
    email,
    token
  }
}

export const mapDispatchToProps = {
  push,
  verifyEmail
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { email, token } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    verifyEmail: (code) => {
      dispatchProps.verifyEmail(email, code, token).then(
        () => { dispatchProps.push('/signup/finish') },
        (e) => {
          /* Error is added to the state by login reducer but we need to catch it here too */
          if (e.message === 'invalid-link') {
            dispatchProps.push('/signup?error=invalid-link')
          }
          // Else just show the error on this page
        }
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
