import React from 'react'
import { uniq } from 'lodash'
import './NonAuthLayout.scss'

export function formatError (error, action) {
  if (!error) return

  const noPasswordMatch = error.match(/password account not found. available: \[(.*)\]/)
  if (noPasswordMatch) {
    var options = uniq(noPasswordMatch[1].split(',')
    .map(option => ({
      'google': 'Google',
      'google-token': 'Google',
      'facebook': 'Facebook',
      'facebook-token': 'Facebook',
      'linkedin': 'LinkedIn',
      'linkedin-token': 'LinkedIn'
    }[option])))

    return <div styleName='error'>
      Your account has no password set. <a href='/reset-password'>Set your password here.</a>
      {options[0] && <span><br />Or log in with {options.join(' or ')}.</span>}
    </div>
  }

  var text
  switch (error) {
    case 'no user':
      text = `${action} was canceled or no user data was found.`
      break
    case 'no email':
      text = 'The user data did not include an email address.'
      break
    default:
      text = error
  }

  return <div styleName='error'>{text}</div>
}
