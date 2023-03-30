/* eslint-disable quote-props */
import React from 'react'
import { uniq } from 'lodash'
import './NonAuthLayoutRouter.scss'

export function formatError (error, action) {
  if (!error) return

  const noPasswordMatch = error.match(/password account not found. available: \[(.*)\]/)

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
        Your account has no password set. <a href='/reset-password'>Set your password here.</a>
        {options[0] && (
          <span><br />Or log in with {options.join(' or ')}.</span>
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
    let err

    if (testJSON(type)) {
      err = JSON.parse(type)
      err = err.error
    } else {
      err = type
    }

    const errors = {
      'no user': `${action} was canceled or no user data was found.`,
      'no email': 'Please enter a valid email address',
      'no email provided': 'Please enter a valid email address',
      'invalid-email': 'Please enter a valid email address',
      'duplicate-email': 'Account already exists',
      'no password provided': 'Please enter your password',
      'email not found': 'Email address not found',
      'invalid-code': 'Invalid code, please try again',
      'invalid-link': 'Link expired, please start over',
      'invite-expired': 'Sorry, your invitation to this group is expired, has already been used, or is invalid. Please contact a group moderator for another one.',
      // From oidc-provider
      'invalid_request': 'Request expired, please start over',
      default: err
    }

    return errors[err] || errors.default
  }

  return <div styleName='error'>{errorMessages(error)}</div>
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
