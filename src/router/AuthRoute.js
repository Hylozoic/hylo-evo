import React from 'react'
import { Route, useLocation } from 'react-router'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import setReturnToURL from 'store/actions/setReturnToURL'
import { useDispatch, useSelector } from 'react-redux'

// https://stackoverflow.com/questions/57012695/react-save-old-url-before-route-redirect

export default function AuthRoute ({
  component,
  returnToOnAuth,
  ...rest
}) {
  const location = useLocation()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(getIsLoggedIn)

  // On mobile we want to only store the intended URL and forward to the
  // download app modal (which is currently on the Login component/page)
  // Specifically we don't want any components to do any work but this,
  // namely JoinGroup which utilizes returnToOnAuth) and may attempt
  // to auth the user with a token and send them into sign-up.
  if (!isLoggedIn && returnToOnAuth) {
    dispatch(setReturnToURL(location.pathname + location.search))
  }

  return <Route {...rest} render={props => React.createElement(component, props)} />
}
