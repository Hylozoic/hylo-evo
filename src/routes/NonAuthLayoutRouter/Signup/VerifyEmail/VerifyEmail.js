import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import ReactCodeInput from 'react-code-input'
import { formatError } from '../../util'
import getGraphqlResponseError from 'store/selectors/getGraphqlResponseError'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { verifyEmail } from '../Signup.store'
import Loading from 'components/Loading'
import '../Signup.scss'
import getMe from 'store/selectors/getMe'

export default function VerifyEmail (props) {
  const dispatch = useDispatch()
  const { className } = props
  const currentUser = useSelector(getMe)
  const email = currentUser?.email || getQuerystringParam('email', null, props)
  const token = getQuerystringParam('token', null, props)
  const providedError = useSelector(getGraphqlResponseError)
  const [error, setErrorBase] = useState(providedError)
  const setError = errorMessage => setErrorBase(providedError || errorMessage)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If we get here through a login link with JWT token then immediately check the code with the link
    // TODO: show the code getting filled in? Maybe we dont even need a JWT, just pass the link in the URL? Still better to hide in the JWT?
    if (token) {
      submit()
    }
  }, [])

  if (!email) {
    return <Redirect to='/signup' />
  }

  const submit = async value => {
    try {
      setLoading(true)

      const result = await dispatch(verifyEmail(email, value || code, token))
      const error = result.payload.data.verifyEmail?.error

      if (error) {
        setError(error)
      }
    } catch (error) {
      // Error is added to the state by login reducer but we need to catch it here too
      dispatch(push(`/signup?error=${error.message}`))
      // Else just show the error on this page
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  const handleChange = (value) => {
    if (value.length === 6) {
      submit(value)
    }
    setCode(value)
  }

  return (
    <div className={className}>
      <Link to='/signup' styleName='back-button'>&#8592; back</Link>
      <div styleName='formWrapper'>
        <h1 styleName='title'>Check your email</h1>
        <p styleName='sub-header'>We've sent a 6 digit code to {email}. The code will expire shortly, so please enter it here soon.</p>
        {error && formatError(error, 'Signup')}
        <div styleName='codeWrapper'>
          <ReactCodeInput type='text' fields={6} onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}
