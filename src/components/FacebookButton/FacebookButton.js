import React from 'react'
import cx from 'classnames'
import Icon from 'components/Icon'
import './FacebookButton.scss'

export default function FacebookButton ({
  onClick,
  signUp,
  className = ''
}) {
  const label = signUp
    ? 'Sign up with Facebook'
    : 'Log in With Facebook'

  return <a
    aria-label={label}
    tabIndex={0}
    styleName={cx('facebook-button', className)}
    onClick={onClick}
  >
    <Icon name='Facebook' />
    {label}
  </a>
}
