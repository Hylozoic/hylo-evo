import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { mobileRedirect } from 'util/mobile'
import getLoginError from 'store/selectors/getLoginError'
import getReturnToURL from 'store/selectors/getReturnToURL'
import resetReturnToURL from 'store/actions/resetReturnToURL'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { sendEmailVerification as sendEmailVerificationAction } from './Signup.store'
import loginWithService from 'store/actions/loginWithService'
import Button from 'components/Button'
import DownloadAppModal from 'components/DownloadAppModal'
import FacebookButton from 'components/FacebookButton'
import GoogleButton from 'components/GoogleButton'
import TextInput from 'components/TextInput'
import { formatError } from '../util'
import { validateEmail } from 'util/index'
import './Signup.scss'

export default function Signup (props) {
  const { className } = props
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [localError, setLocalError] = useState()
  const downloadAppUrl = useSelector(mobileRedirect)
  const providedError = useSelector(state =>
    getLoginError(state) || getQuerystringParam('error', state, props)
  )
  // TODO: `returnToURL` querystring param could be handled by the Router along with returnToURL logic
  const returnToURL = useSelector(state =>
    getQuerystringParam('returnToUrl', state, props) || getReturnToURL(state)
  )
  const error = providedError || localError

  // TODO: Why is this here instead of relying on it happening in `PrimaryLayout`?
  const redirectOnSignIn = defaultPath => {
    dispatch(resetReturnToURL())
    dispatch(push(returnToURL || defaultPath))
  }

  const sendEmailVerification = async email => {
    const { payload } = await dispatch(sendEmailVerificationAction(email))
    const { success, error } = payload.getData()
    if (success) {
      dispatch(push('/signup/verify-email?email=' + encodeURIComponent(email)))
    } else if (error) {
      setLocalError(error)
    }
  }

  const signupAndRedirect = async service => {
    const result = await dispatch(loginWithService(service))
    if (result?.e) {
      setLocalError(result.e)
    } else {
      redirectOnSignIn('/')
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setLocalError()
  }

  const submit = () => {
    if (!validateEmail(email)) {
      setLocalError('Invalid email address')
    } else {
      setLocalError()
      sendEmailVerification(email)
    }
  }

  const canSubmit = email?.length > 0

  return (
    <div className={className}>
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
        <FacebookButton onClick={() => signupAndRedirect('facebook')} />
        <GoogleButton onClick={() => signupAndRedirect('google')} />
      </div>
    </div>
  )
}
