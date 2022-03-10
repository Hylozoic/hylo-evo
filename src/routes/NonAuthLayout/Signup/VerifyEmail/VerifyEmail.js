import React, { useEffect, useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { Link } from 'react-router-dom'

import { formatError } from '../../util'

import '../Signup.scss'

export default function VerifyEmail (props) {
  const { className, email, error, token } = props
  const [code, setCode] = useState('')

  // If we get here through a login link with JWT token then immediately check the code with the link
  // TODO: show the code getting filled in? Maybe we dont even need a JWT, just pass the link in the URL? Still better to hide in the JWT?
  if (token) {
    useEffect(() => props.verifyEmail(), [])
  }

  const submit = (value) => {
    props.verifyEmail(value || code)
  }

  const onChange = (value) => {
    if (value.length === 6) {
      submit(value)
    }
    setCode(value)
  }

  return <div className={className}>
    <Link to='/signup' styleName='back-button'>&#8592; back</Link>
    <div styleName='formWrapper'>
      <h1 styleName='title'>Check your email</h1>
      <p styleName='sub-header'>We've sent a 6 digit code to {email}. The code will expire shortly, so please enter it here soon.</p>
      {error && formatError(error, 'Signup')}
      <div styleName='codeWrapper'>
        <ReactCodeInput type='text' fields={6} onChange={onChange} />
      </div>
    </div>
  </div>
}
