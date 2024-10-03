import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { validateEmail } from 'util/index'
import { checkForStorageAccess, formatError } from '../util'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import checkLogin from 'store/actions/checkLogin'
import { sendEmailVerification as sendEmailVerificationAction } from './Signup.store'
import loginWithService from 'store/actions/loginWithService'
import Button from 'components/Button'
import GoogleButton from 'components/GoogleButton'
import TextInput from 'components/TextInput'
import classes from './Signup.module.scss'

export default function Signup (props) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState()
  const location = useLocation()
  const [error, setError] = useState(getQuerystringParam('error',{ location }))
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

  if (redirectTo) return <Navigate to={redirectTo} replace />

  return (
    <div className={classes.form}>
      <div className={classes.formWrapper}>
        <h1 className={classes.title}>{t('Welcome to Hylo')}</h1>
        <p className={classes.blurb}>{t('Stay connected, organized, and engaged with your group.')}</p>
        <p className={classes.or}>{t('Enter your email to get started:')}</p>

        {error && formatError(error, 'Signup', t)}

        <TextInput
          aria-label='email'
          label='email'
          name='email'
          id='email'
          autoComplete='off'
          autoFocus
          internalLabel={t('Email')}
          onChange={handleEmailChange}
          onEnter={submit}
          className={classes.field}
          type='text'
          value={email || ''}
        />

        <Button
          className={cx(classes.submit, { [classes.green]: canSubmit, [classes.gray]: !canSubmit })}
          label={t('Continue')}
          onClick={canSubmit ? () => submit() : null}
        />
      </div>

      <p className={classes.or}>{t('Or sign in with an existing account')}: </p>

      <div className={classes.authButtons}>
        <GoogleButton onClick={() => handleSignupWithService('google')} />
      </div>
    </div>
  )
}
