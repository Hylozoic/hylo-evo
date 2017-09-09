import React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import { SET_RETURN_TO_URL } from 'store/constants'

function AuthRoute ({ component, isLoggedIn, setReturnToURL, location, ...rest }) {
  if (!isLoggedIn) setReturnToURL(location.pathname + location.search)
  return <Route {...rest} render={props => isLoggedIn
      ? React.createElement(component, props)
      : <Redirect to={'/login'} />
  } />
}

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state)
  }
}

export default connect(mapStateToProps, { setReturnToURL })(AuthRoute)

function setReturnToURL (returnToURL) {
  return {
    type: SET_RETURN_TO_URL,
    payload: { returnToURL }
  }
}
