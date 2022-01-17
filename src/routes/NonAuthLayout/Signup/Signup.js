import React, { useState } from 'react'

import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import TextInput from 'components/TextInput'
import { formatError } from '../util'
import { validateEmail } from 'util/index'

import './Signup.scss'

export default function Signup (props) {
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState('')
  const error = props.error || localError

  const submit = () => {
    if (!validateEmail(email)) {
      setLocalError('Invalid email address')
    } else {
      setLocalError('')
      props.sendEmailVerification(email)
    }
  }

  const signupAndRedirect = (service) => {
    props.loginWithService(service)
      .then(({ e }) => { e ? setLocalError(e) : props.redirectOnSignIn('/') })
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    setLocalError('')
  }

  const { className, downloadAppUrl } = props

  const canSubmit = email.length > 0

  return <div className={className}>
    <div styleName='formWrapper'>
      {downloadAppUrl && <DownloadAppModal url={downloadAppUrl} />}
      <h1 styleName='title'>Welcome to Hylo</h1>
      <p styleName='blurb'>Stay connected, organized, and engaged with your group.</p>
      <p styleName='or'>Enter your email to get started:</p>
      {error && formatError(error, 'Signup')}

      <TextInput
        aria-label='email' label='email' name='email' id='email'
        autoComplete='off'
        autoFocus
        internalLabel='Email'
        onChange={handleChange}
        onEnter={submit}
        styleName='field'
        type='text'
        value={email}
      />

      <Button styleName='submit' label='Continue' color={canSubmit ? 'green' : 'gray'}
        onClick={canSubmit ? () => submit() : null} />
    </div>

    <p styleName='or'>Or sign in with an existing account: </p>

    <div styleName='auth-buttons'>
      <FacebookButton onClick={() => signupAndRedirect('facebook')} />
      <GoogleButton onClick={() => signupAndRedirect('google')} />
    </div>
  </div>
}
