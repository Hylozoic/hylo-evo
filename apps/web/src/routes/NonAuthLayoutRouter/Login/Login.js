import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { checkForStorageAccess, formatError } from '../util'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import checkLogin from 'store/actions/checkLogin'
import login from 'store/actions/login'
import loginWithService from 'store/actions/loginWithService'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import GoogleButton from 'components/GoogleButton'
import './Login.scss'

export default function Login (props) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState(getQuerystringParam('error', null, props))
  const { t } = useTranslation()
  const DEFAULT_LOGIN_ERROR = t('Sorry, that Email and Password combination didn\'t work.')

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleLogin = async () => {
    // XXX: needed by Safari to allow for login in an iframe
    checkForStorageAccess(
      async () => {
        const { payload } = await dispatch(login(email, password))
        const { me, error } = payload.getData()

        if (error) {
          setError(error)
        }

        if (!me) {
          setError(DEFAULT_LOGIN_ERROR)
        }
      },
      () => {
        // Storage access was denied.
        console.error('Denied access to browser storage')
      }
    )
  }

  const handleLoginWithService = async service => {
    // XXX: needed by Safari to allow for login in an iframe
    checkForStorageAccess(
      async () => {
        try {
          const result = await dispatch(loginWithService(service))

          if (result?.error) {
            return setError(result.error)
          }

          // Required for Me data to be available to cause switch to auth'd
          // layout (i.e. AuthLayoutRouter)
          dispatch(checkLogin())
        } catch (error) {
          setError(error.message)
        }
      },
      () => {
        // Storage access was denied.
        setError('Denied access to browser storage')
      }
    )
  }

  return (
    <div className={props.className}>
      <div styleName='formWrapper'>
        <h1 styleName='title'>{t('Sign in to Hylo')}</h1>

        {error && formatError(error, 'Login', t)}

        <TextInput
          aria-label='email' label='email' name='email' id='email'
          autoFocus
          internalLabel={t('Email')}
          onChange={handleEmailChange}
          styleName='field'
          type='email'
          value={email || ''}
        />

        <TextInput
          aria-label='password' label='password' name='password' id='password'
          internalLabel={t('Password')}
          onChange={handlePasswordChange}
          onEnter={handleLogin}
          styleName='field'
          type='password'
          value={password || ''}
        />

        <Link to='/reset-password' styleName='forgot-password'>
          <span styleName='forgot-password'>{t('Forgot password?')}</span>
        </Link>

        <Button styleName='submit' label={t('Sign in')} onClick={handleLogin} />
      </div>
      <div styleName='auth-buttons'>
        <GoogleButton onClick={() => handleLoginWithService('google')} />
      </div>
    </div>
  )
}
