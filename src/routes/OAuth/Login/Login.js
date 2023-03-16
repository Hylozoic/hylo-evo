import { push } from 'connected-react-router'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { formatError } from 'routes/NonAuthLayoutRouter/util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import { login } from './Login.store'
import './Login.scss'

export default function Login (props) {
  const dispatch = useDispatch()

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

  return authenticated ? <div>Already logged in, redirecting...</div>
    : (
      <div className={className}>
        <div styleName='formWrapper'>
          <h1 styleName='title'>Sign in to Hylo</h1>
          {error && formatError(error, 'Login')}

          <TextInput
            aria-label='email' label='email' name='email' id='email'
            autoFocus
            internalLabel='Email'
            onChange={handleSetEmail}
            styleName='field'
            type='text'
            value={email}
          />

          <TextInput
            aria-label='password' label='password' name='password' id='password'
            internalLabel='Password'
            onChange={handleSetPassword}
            onEnter={submit}
            styleName='field'
            type='password'
            value={password}
          />
          <Link to='/reset-password' styleName='forgot-password'>
            <span styleName='forgot-password'>Forgot password?</span>
          </Link>

          <Button styleName='submit' label='Sign in' onClick={submit} />
        </div>

        {/* <div styleName='auth-buttons'>
          <FacebookButton onClick={() => this.loginAndRedirect('facebook')} />
          <GoogleButton onClick={() => this.loginAndRedirect('google')} />
        </div> */}
      </div>
    )
}
