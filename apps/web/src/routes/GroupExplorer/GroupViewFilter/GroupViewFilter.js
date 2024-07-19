import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { ALL_VIEW, FARM_VIEW } from 'util/constants'
import './GroupViewFilter.scss'

export default function GroupViewFilter ({ viewFilter, changeView }) {
  const { t } = useTranslation()
  return <div styleName={'filter-container'}>
    <Button borderRadius='5px' onClick={() => changeView(ALL_VIEW)} color={viewFilter === ALL_VIEW ? 'gray' : 'whitegray'}>{t('All')}</Button>
    <Button borderRadius='5px' onClick={() => changeView(FARM_VIEW)} color={viewFilter === FARM_VIEW ? 'gray' : 'whitegray'}>{t('Farms')}</Button>
  </div>
}
