import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { validateEmail } from 'util/index'
import { formatError } from '../util'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import checkLogin from 'store/actions/checkLogin'
import { sendEmailVerification as sendEmailVerificationAction } from './Signup.store'
import loginWithService from 'store/actions/loginWithService'
import Button from 'components/Button'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import TextInput from 'components/TextInput'
import './Signup.scss'

export default function Signup (props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [error, setError] = useState(getQuerystringParam('error', null, props))

  const sendEmailVerification = async email => {
    const { payload } = await dispatch(sendEmailVerificationAction(email))
    const { success, error } = payload.getData()

    if (success) {
      history.push('/signup/verify-email?email=' + encodeURIComponent(email))
    } else if (error) {
      setError(error)
    }
  }

  const handleSignupWithService = async service => {
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
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setError()
  }

  const submit = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address')
    } else {
      setError()
      sendEmailVerification(email)
    }
  }

  const canSubmit = email?.length > 0

  return (
    <div styleName='form'>
      <div styleName='formWrapper'>
        <h1 styleName='title'>Welcome to Hylo</h1>
        <p styleName='blurb'>Stay connected, organized, and engaged with your group.</p>
        <p styleName='or'>Enter your email to get started:</p>

        {error && formatError(error, 'Signup')}

        <TextInput
          aria-label='email' label='email' name='email' id='email'
          autoComplete='off'
          autoFocus
          internalLabel='Email'
          onChange={handleEmailChange}
          onEnter={submit}
          styleName='field'
          type='text'
          value={email || ''}
        />

        <Button
          styleName='submit' label='Continue' color={canSubmit ? 'green' : 'gray'}
          onClick={canSubmit ? () => submit() : null}
        />
      </div>

      <p styleName='or'>Or sign in with an existing account: </p>

      <div styleName='auth-buttons'>
        <FacebookButton onClick={() => handleSignupWithService('facebook')} />
        <GoogleButton onClick={() => handleSignupWithService('google')} />
      </div>
    </div>
  )
}
