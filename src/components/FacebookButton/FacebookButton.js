import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Icon from 'components/Icon'
import './FacebookButton.scss'

export default function FacebookButton ({
  onClick,
  signUp,
  className = ''
}) {
  const { t } = useTranslation()
  const label = t('Continue with Facebook')

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
