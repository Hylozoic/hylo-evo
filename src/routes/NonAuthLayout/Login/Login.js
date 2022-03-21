import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { formatError } from '../util'
import { mobileRedirect } from 'util/mobile'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import getLoginError from 'store/selectors/getLoginError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import checkLogin from 'store/actions/checkLogin'
import login from 'store/actions/login'
import loginWithService from 'store/actions/loginWithService'
import logout from 'store/actions/logout'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import './Login.scss'

export default function Login (props) {
  const dispatch = useDispatch()
  const errorFromStore = useSelector(state =>
    getLoginError(state) || getQuerystringParam('error', state, props)
  )
  const returnToURL = useSelector(state =>
    getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state)
  )
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState()
  const downloadAppUrl = mobileRedirect()
  const displayError = error || errorFromStore

  // const redirectOnSignIn = defaultPath => {
  //   dispatch(resetReturnToURL())
  //   dispatch(push(returnToURL || defaultPath))
  // }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLogin = async () => {
    // await dispatch(logout())
    const { payload } = await dispatch(login(email, password))
    const { me, error } = payload.getData()

    if (!me || error) {
      setError(error || 'Sorry, that Email and Password combination didn\'t work.')
    }
  }

  const handleLoginWithService = async service => {
    const result = await dispatch(loginWithService(service))

    if (result?.error) {
      return setError(result.error)
    }

    // Current user data is required to be present for routing
    // to switch to auth'd layouts (i.e. PrimaryLayout)
    dispatch(checkLogin())
  }

  return (
    <div className={props.className}>
      <div styleName='formWrapper'>
        {downloadAppUrl && (
          <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />
        )}
        <h1 styleName='title'>Sign in to Hylo</h1>
        {displayError && formatError(displayError, 'Login')}
        <TextInput
          aria-label='email' label='email' name='email' id='email'
          autoFocus
          internalLabel='Email'
          onChange={handleEmailChange}
          styleName='field'
          type='email'
          value={email || ''}
        />
        <TextInput
          aria-label='password' label='password' name='password' id='password'
          internalLabel='Password'
          onChange={handlePasswordChange}
          onEnter={handleLogin}
          styleName='field'
          type='password'
          value={password || ''}
        />
        <Link to='/reset-password' styleName='forgot-password'>
          <span styleName='forgot-password'>Forgot password?</span>
        </Link>
        <Button styleName='submit' label='Sign in' onClick={handleLogin} />
      </div>
      <div styleName='auth-buttons'>
        <FacebookButton onClick={() => handleLoginWithService('facebook')} />
        <GoogleButton onClick={() => handleLoginWithService('google')} />
      </div>
    </div>
  )
}
