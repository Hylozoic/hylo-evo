import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactCodeInput from 'react-code-input'
import { formatError } from '../../util'
import getMe from 'store/selectors/getMe'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { sendEmailVerification as sendEmailVerificationAction, verifyEmail } from '../Signup.store'
import Loading from 'components/Loading'
import '../Signup.scss'

export default function VerifyEmail (props) {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const email = currentUser?.email || getQuerystringParam('email', props)
  const token = getQuerystringParam('token', props)
  const [error, setError] = useState()
  const [code, setCode] = useState('')
  const [redirectTo, setRedirectTo] = useState()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const sendEmailVerification = async email => {
    const { payload } = await dispatch(sendEmailVerificationAction(email))
    const { success, error } = payload.getData()

    if (error) setError(error)

    if (success) setRedirectTo(`/signup/verify-email?email=${encodeURIComponent(email)}`)
  }

  useEffect(() => {
    if (token) submit()
  }, [])

  if (!email) return <Redirect to='/signup' />

  const submit = async value => {
    try {
      setLoading(true)
      const result = await dispatch(verifyEmail(email, value || code, token))
      const error = result?.payload?.getData()?.error

      if (error) setError(error)
    } catch (requestError) {
      // Resolver errors are caught and sent-on as `payload.verifyEmail.error`
      // so this `catch` is for the the case of a network availability or a server
      // implementation issue. It probably can and maybe should be removed.
      setRedirectTo(`/signup?error=${requestError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (value) => {
    if (value.length === 6) {
      submit(value)
    }
    setCode(value)
  }

  if (redirectTo) return <Redirect to={redirectTo} />

  if (loading) return <Loading />

  return (
    <div styleName='form'>
      <Link to='/signup' styleName='back-button'>&#8592; {t('back')}</Link>
      <div styleName='formWrapper'>
        <h1 styleName='title'>{t('Check your email')}</h1>
        <p styleName='sub-header'>{t("We've sent a 6 digit code to {{email}}. The code will expire shortly, so please enter it here soon.", { email })}</p>
        {error && formatError(error, 'Signup', t)}
        <div styleName='codeWrapper'>
          <ReactCodeInput type='text' fields={6} onChange={handleChange} />
        </div>
      </div>
      <div onClick={() => sendEmailVerification(email)} styleName='resend'>{t('Resend code')}</div>
    </div>
  )
}
