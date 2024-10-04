import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import getMe from 'store/selectors/getMe'
import { register } from '../Signup.store'
import logout from 'store/actions/logout'
import Button from 'components/Button'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { formatError } from '../../util'
import classes from '../Signup.module.scss'

export default function FinishRegistration () {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const [error, setError] = useState()
  const { email, name } = currentUser
  const [formValues, setFormValues] = useState({
    name: name || '',
    password: '',
    passwordConfirmation: ''
  })
  const canSubmit = formValues.name.length > 1 &&
    formValues.password.length > 8 &&
    formValues.passwordConfirmation.length > 8

  const handleCancel = () => {
    if (window.confirm(t("We're almost done, are you sure you want to cancel?"))) {
      dispatch(logout())
    }
  }

  const handleSubmit = async () => {
    try {
      if (formValues.password !== formValues.passwordConfirmation) {
        setError(t("Passwords don't match"))
      } else {
        const result = await dispatch(register(formValues.name, formValues.password))
        const error = result?.payload?.getData()?.error

        if (error) setError(error)
      }
    } catch (responseError) {
      setError(responseError.message)
    }
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    setError(null)
    setFormValues(prevState => ({ ...prevState, [name]: value }))
  }

  return (
    <div className={classes.form}>
      <Icon name='Ex' className={classes.closeIcon} onClick={handleCancel} />
      <div className={classes.formWrapper}>
        <h1 className={classes.title}>{t('One more step!')}</h1>
        <p className={classes.blurb}>{t(`Hi {{email}} we just need to know your name and password and you're in.`, { email })}</p>
        {error && formatError(error, 'Signup', t)}
        <TextInput
          aria-label='name'
          autoFocus
          id='name'
          internalLabel={t('Name')}
          label='name'
          name='name'
          onChange={handleChange}
          className={classes.field}
          type='text'
          value={formValues.name}
        />
        <TextInput
          aria-label='password'
          autoComplete='off'
          id='password'
          internalLabel={t('Password (at least 9 characters)')}
          label='password'
          name='password'
          onChange={handleChange}
          className={classes.field}
          type='password'
          value={formValues.password}
        />
        <TextInput
          aria-label='passwordConfirmation'
          autoComplete='off'
          id='passwordConfirmation'
          internalLabel={t('Confirm Password')}
          label='passwordConfirmation'
          name='passwordConfirmation'
          onChange={handleChange}
          onEnter={handleSubmit}
          className={classes.field}
          type='password'
          value={formValues.passwordConfirmation}
        />
        <Button
          className={classes.submit}
          label={t('Jump in to Hylo!')}
          color={canSubmit ? 'green' : 'gray'}
          onClick={canSubmit ? () => handleSubmit() : null}
        />
      </div>
    </div>
  )
}
