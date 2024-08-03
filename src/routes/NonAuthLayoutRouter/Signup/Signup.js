import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { validateEmail } from 'util/index'
import { checkForStorageAccess, formatError } from '../util'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import checkLogin from 'store/actions/checkLogin'
import { sendEmailVerification as sendEmailVerificationAction } from './Signup.store'
import loginWithService from 'store/actions/loginWithService'
import Button from 'components/Button'
import GoogleButton from 'components/GoogleButton'
import TextInput from 'components/TextInput'
import './Signup.scss'

export default function Signup (props) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const [error, setError] = useState(getQuerystringParam('error', props))
  const [redirectTo, setRedirectTo] = useState()
  const { t } = useTranslation()

  const sendEmailVerification = async email => {
    const { payload } = await dispatch(sendEmailVerificationAction(email))
    const { success, error } = payload.getData()

    if (error) setError(error)

    if (success) setRedirectTo(`/signup/verify-email?email=${encodeURIComponent(email)}`)
  }

  const handleSignupWithService = async service => {
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setError()
  }

  const submit = () => {
    if (!validateEmail(email)) {
      setError(t('Invalid email address'))
    } else {
      // XXX: needed by Safari to allow for login in an iframe
      checkForStorageAccess(
        () => {
          setError()
          sendEmailVerification(email)
        },
        () => {
          // Storage access was denied.
          console.error('Denied access to browser storage')
        }
      )
    }
  }

  const canSubmit = email?.length > 0

  if (redirectTo) return <Redirect to={redirectTo} />

  return (
    <div styleName='form'>
      <div styleName='formWrapper'>
        <h1 styleName='title'>{t('Welcome to Hylo')}</h1>
        <p styleName='blurb'>{t('Stay connected, organized, and engaged with your group.')}</p>
        <p styleName='or'>{t('Enter your email to get started:')}</p>

        {error && formatError(error, 'Signup', t)}

        <TextInput
          aria-label='email' label='email' name='email' id='email'
          autoComplete='off'
          autoFocus
          internalLabel={t('Email')}
          onChange={handleEmailChange}
          onEnter={submit}
          styleName='field'
          type='text'
          value={email || ''}
        />

        <Button
          styleName='submit' label={t('Continue')} color={canSubmit ? 'green' : 'gray'}
          onClick={canSubmit ? () => submit() : null}
        />
      </div>

      <p styleName='or'>{t('Or sign in with an existing account')}: </p>

      <div styleName='auth-buttons'>
        <GoogleButton onClick={() => handleSignupWithService('google')} />
      </div>
    </div>
  )
}
