import React, { useEffect, useState } from 'react'

import TextInput from 'components/TextInput'
import Button from 'components/Button'
import Loading from 'components/Loading'
import RedirectRoute from 'router/RedirectRoute'
import { formatError } from '../../util'

import '../Signup.scss'

export default function FinishRegistration (props) {
  const { className, currentUser } = props

  useEffect(() => {
    props.checkRegistrationStatus()
  }, [])

  if (!currentUser) return <Loading />

  const { email, hasRegistered, name } = currentUser

  if (!email) return <RedirectRoute to='/signup' />

  if (hasRegistered) return <RedirectRoute to='/' />

  const [error, setError] = useState('')

  const [formValues, setFormValues] = useState({
    name: name || '',
    password: '',
    passwordConfirmation: ''
  })

  const displayError = props.error || error
  const canSubmit = formValues.name.length > 0 && formValues.password.length > 0 && !error

  const submit = () => {
    if (canSubmit) {
      props.signup(email, formValues.name, formValues.password)
        .then(() => { props.redirectOnSignIn('/') }, (e) => { /* Error */ })
    }
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    let newError = ''

    if (name === 'password') {
      if (value !== formValues.passwordConfirmation) newError = 'Passwords don\'t match'
      if (value.length > 0 && value.length < 9) newError = 'Passwords must be at least 9 characters long'
    }

    if (name === 'passwordConfirmation') {
      if (value !== formValues.password) newError = 'Passwords don\'t match'
    }

    setError(newError)

    setFormValues(prevState => {
      return { ...prevState, [name]: value }
    })
  }

  return <div className={className}>
    <div styleName='formWrapper'>
      <h1 styleName='title'>One more step!</h1>
      <p styleName='blurb'>Hi {email} we just need to know your name and password and you're in.</p>
      {displayError && formatError(displayError, 'Signup')}

      <TextInput
        aria-label='name'
        autoFocus
        id='name'
        internalLabel='Name'
        label='name'
        name='name'
        onChange={handleChange}
        styleName='field'
        type='text'
        value={formValues.name}
      />

      <TextInput
        aria-label='password'
        autoComplete='off'
        id='password'
        internalLabel='Password'
        label='password'
        name='password'
        onChange={handleChange}
        styleName='field'
        type='password'
        value={formValues.password}
      />

      <TextInput
        aria-label='passwordConfirmation'
        autoComplete='off'
        id='passwordConfirmation'
        internalLabel='Confirm Password'
        label='passwordConfirmation'
        name='passwordConfirmation'
        onChange={handleChange}
        onEnter={submit}
        styleName='field'
        type='password'
        value={formValues.passwordConfirmation}
      />

      <Button styleName='submit' label='Jump in to Hylo!' color={canSubmit ? 'green' : 'gray'}
        onClick={canSubmit ? () => submit() : null} />
    </div>
  </div>
}
