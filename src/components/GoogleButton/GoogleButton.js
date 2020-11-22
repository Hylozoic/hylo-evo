import React from 'react'
import cx from 'classnames'
import './GoogleButton.scss'

export default function FacebookButton ({
  onClick,
  signUp,
  className = ''
}) {
  const label = signUp
    ? 'Sign up with Google'
    : 'Log in with Google'

  return <a
    aria-label={label}
    tabIndex={0}
    styleName={cx('google-button', className)}
    onClick={onClick}
  >
    <img src='assets/btn_google_light_normal_ios.svg' />
    {label}
  </a>
}
