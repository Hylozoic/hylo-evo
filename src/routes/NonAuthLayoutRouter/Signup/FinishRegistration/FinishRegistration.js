import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { register } from '../Signup.store'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import { formatError } from '../../util'
import '../Signup.scss'

export default function FinishRegistration () {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const { email, name } = currentUser
  const [error, setError] = useState()
  const [formValues, setFormValues] = useState({
    name: name || '',
    password: '',
    passwordConfirmation: ''
  })
  const canSubmit = formValues.name.length > 1 &&
    formValues.password.length > 8 &&
    formValues.passwordConfirmation.length > 8

  const submit = async () => {
    try {
      if (formValues.password !== formValues.passwordConfirmation) {
        setError("Passwords don't match")
      } else {
        setError(null)
        await dispatch(register(formValues.name, formValues.password))
        // will switch to AuthLayoutRouter handling once `register` returns the updated `me`
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
    <div styleName='form'>
      <div styleName='formWrapper'>
        <h1 styleName='title'>One more step!</h1>
        <p styleName='blurb'>Hi {email} we just need to know your name and password and you're in.</p>
        {error && formatError(error, 'Signup')}
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
          internalLabel='Password (at least 9 characters)'
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
        <Button
          styleName='submit'
          label='Jump in to Hylo!'
          color={canSubmit ? 'green' : 'gray'}
          onClick={canSubmit ? () => submit() : null}
        />
      </div>
    </div>
  )
}
