import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import './GoogleButton.scss'

export default function GoogleButton ({
  onClick,
  signUp,
  className = ''
}) {
  const { t } = useTranslation()
  const label = t('Continue with Google')

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
