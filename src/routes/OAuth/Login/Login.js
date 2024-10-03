import { push } from 'redux-first-history'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { formatError } from 'routes/NonAuthLayoutRouter/util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import { login } from './Login.store'
import classes from './Login.module.scss'

export default function Login (props) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const params = useParams()

  const oauthUID = params.uid

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  if (props.authenticated) {
    useEffect(() => {
      // If already authenticated then do the oAuth login with current session user
      submit()
    }, [])
  }

  const submit = async () => {
    try {
      const { payload } = await dispatch(login(oauthUID, email, password))
      const { redirectTo } = payload
      if (redirectTo) {
        window.location.href = redirectTo
      } else {
        dispatch(push('/'))
      }
    } catch (e) {
      setError(e.message)
    }
  }

  // TODO: let people log in with Google to login with Hylo? 🤪
  // loginAndRedirect = (service) => {
  //   this.props.loginWithService(service)
  //     .then(({ error }) => error || this.props.redirectOnSignIn('/'))
  // }

  const handleSetEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleSetPassword = (e) => {
    setPassword(e.target.value)
  }

  const { authenticated, className } = props
  return authenticated ? <div>{t('Already logged in, redirecting...')}</div>
    : (
      <div className={className}>
        <div className={classes.formWrapper}>
          <h1 className={classes.title}>{t('Sign in to Hylo')}</h1>
          {error && formatError(error, 'Login')}

          <TextInput
            aria-label='email'
            label='email'
            name='email'
            id='email'
            autoFocus
            internalLabel='Email'
            onChange={handleSetEmail}
            className={classes.field}
            type='text'
            value={email}
          />

          <TextInput
            aria-label='password'
            label='password'
            name='password'
            id='password'
            internalLabel='Password'
            onChange={handleSetPassword}
            onEnter={submit}
            className={classes.field}
            type='password'
            value={password}
          />
          <Link to='/reset-password' className={classes.forgotPassword}>
            <span className={classes.forgotPassword}>{t('Forgot password?')}</span>
          </Link>

          <Button className={classes.submit} label='Sign in' onClick={submit} />
        </div>

        {/* <div className={classes.authButtons}>
          <GoogleButton onClick={() => this.loginAndRedirect('google')} />
        </div> */}
      </div>
    )
}
