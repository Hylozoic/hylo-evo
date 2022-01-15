import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatError } from '../../util'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import './Login.scss'

export default function Login (props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = () => {
    return props.login(email, password).then((results) => {
      const { redirectTo } = results.payload
      redirectTo ? window.location.href = redirectTo : props.redirectOnSignIn('/')
    })
  }

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

  const { className, downloadAppUrl, error, returnToURL } = props

  return <div className={className}>
    <div styleName='formWrapper'>
      {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} returnToURL={returnToURL} />}
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
}
