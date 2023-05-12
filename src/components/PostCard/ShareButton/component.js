/* eslint-disable camelcase */
import React from 'react'
import { useTranslation } from 'react-i18next'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import './component.scss'

export default function ShareButton ({ post, className }) {
  const { t } = useTranslation()
  return <Dropdown toggleChildren={<Icon name='Share' />}>
    <li><a onClick={() => console.log('clicked A')}>{t('A')}</a></li>
    <li><a onClick={() => console.log('clicked List')}>{t('List')}</a></li>
  </Dropdown>
}
