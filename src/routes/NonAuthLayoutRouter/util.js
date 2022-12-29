/* eslint-disable quote-props */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { uniq } from 'lodash'
import './NonAuthLayoutRouter.scss'

export function formatError (error, action) {
  const { t } = useTranslation()
  if (!error) return

  const noPasswordMatch = error.match(/password account not found. available: \[(.*)\]/) // TODO: Handle this translation

  if (noPasswordMatch) {
    const options = uniq(noPasswordMatch[1].split(',')
      .map(option => ({
        'google': 'Google',
        'google-token': 'Google',
        'facebook': 'Facebook',
        'facebook-token': 'Facebook',
        'linkedin': 'LinkedIn',
        'linkedin-token': 'LinkedIn'
      }[option])))

    return (
      <div styleName='error'>
        {t('Your account has no password set.')} <a href='/reset-password'>{t('Set your password here.')}</a>
        {options[0] && (
          <span><br />{t('Or log in with ')}{options.join(t(' or '))}.</span>
        )}
      </div>
    )
  }

  function testJSON (text) {
    if (typeof text !== 'string') {
      return false
    } try {
      JSON.parse(text)
      return true
    } catch (e) {
      return false
    }
  }

  function errorMessages (type) {
    const { t } = useTranslation()
    let err

    if (testJSON(type)) {
      err = JSON.parse(type)
      err = err.error
    } else {
      err = type
    }

    const errors = {
      'no user': t('{{action}} was canceled or no user data was found.', { action }),
      'no email': t('Please enter a valid email address'),
      'no email provided': t('Please enter a valid email address'),
      'invalid-email': t('Please enter a valid email address'),
      'duplicate-email': t('Account already exists'),
      'no password provided': t('Please enter your password'),
      'email not found': t('Email address not found'),
      'invalid-code': t('Invalid code, please try again'),
      'invalid-link': t('Link expired, please start over'),
      'invite-expired': t('Sorry, your invitation to this group is expired, has already been used, or is invalid. Please contact a group moderator for another one.'),
      // From oidc-provider
      'invalid_request': t('Request expired, please start over'),
      default: err
    }

    return errors[err] || errors.default
  }

  return <div styleName='error'>{errorMessages(error, t)}</div>
}

// Used by Safari to make sure we have storage access when in an iFrame
export function checkForStorageAccess (successCallback, errorCallback) {
  if (typeof document.hasStorageAccess === 'function' && typeof document.requestStorageAccess === 'function') {
    const requestStorageAccessPromise = document.requestStorageAccess()
    return requestStorageAccessPromise.then(successCallback, errorCallback)
  } else {
    return successCallback()
  }
}
