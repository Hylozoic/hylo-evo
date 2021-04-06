import React from 'react'
import cx from 'classnames'
import './GoogleButton.scss'

export default function FacebookButton ({
  onClick,
  signUp,
  className = ''
}) {
  const label = 'Continue with Google'

  return <a
    aria-label={label}
    tabIndex={0}
    styleName={cx('google-button', className)}
    onClick={onClick}
  >
    <div styleName='google-icon'><img src='assets/btn_google_light_normal_ios.svg' /></div>
    {label}
  </a>
}
