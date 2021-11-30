import React, { useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { Link } from 'react-router-dom'

import { formatError } from '../../util'

import '../Signup.scss'

export default function VerifyEmail (props) {
  const { className, email, error } = props
  const [code, setCode] = useState('')

  const submit = (value) => {
    props.verifyEmail(email, value || code)
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
