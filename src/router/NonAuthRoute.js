import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getReturnToURL from 'store/selectors/getReturnToURL'
import { RESET_RETURN_TO_URL } from 'store/constants'

function NonAuthRoute ({ component, isLoggedIn, currentUser, returnToURL, resetReturnToURL, ...rest }) {
  if (isLoggedIn) resetReturnToURL()
  return <Route {...rest} render={props => !isLoggedIn
    ? React.createElement(component, props)
    : <Redirect to={returnToURL || '/'} />
  } />
}

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

function resetReturnToURL (returnToURL) {
  return {type: RESET_RETURN_TO_URL}
}

export default connect(mapStateToProps, { resetReturnToURL })(NonAuthRoute)
