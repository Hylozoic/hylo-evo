import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import validator from 'validator'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import classes from './PasswordReset.module.scss'

function PasswordReset ({ className, sendPasswordReset }) {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const emailRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    emailRef.current.focus()
  }, [])

  const submit = () => {
    sendPasswordReset(email)
      .then(({ error }) => {
        if (error) {
          setError(true)
          setSuccess(false)
        } else {
          setSuccess(true)
          setError(false)
        }
      })
  }

  const onChange = event => {
    setEmail(event.target.value)
    setSuccess(false)
    setError(false)
  }

  const canSubmit = validator.isEmail(email)

  return (
    <div className={className}>
      <div className={classes.formWrapper}>
        <h1 className={classes.title}>{t('Reset Your Password')}</h1>
        <div className={classes.subtitle}>
          {t("Enter your email address and we'll send you an email that lets you reset your password.")}
        </div>
        {success && <div className={classes.success}>{t('If your email address matched an account in our system, we sent you an email. Please check your inbox.')}</div>}
        {error && <div className={classes.error}>{t('There was a problem with your request. Please check your email and try again.')}</div>}

        <label>{t('Your email address')}</label>
        <TextInput
          autoFocus
          inputRef={emailRef}
          name='email'
          noClearButton
          onChange={onChange}
          onEnter={submit}
          className={classes.field}
          type='text'
          value={email}
        />

        <Button
          className={classes.submit}
          label={t('Reset')}
          color={canSubmit ? 'green' : 'gray'}
          onClick={canSubmit ? submit : null}
        />
      </div>
    </div>
  )
}

export default PasswordReset
