import React from 'react'
import cx from 'classnames'
import Button from 'components/Button'
import { ALL_VIEW, FARM_VIEW } from 'util/constants'
import './GroupViewFilter.scss'

export default function GroupViewFilter ({ viewFilter, changeView }) {
  return <div styleName={'filter-container'}>
    <Button borderRadius='5px' onClick={() => changeView(ALL_VIEW)} color={viewFilter === ALL_VIEW ? 'gray' : 'whitegray'}>All</Button>
    <Button borderRadius='5px' onClick={() => changeView(FARM_VIEW)} color={viewFilter === FARM_VIEW ? 'gray' : 'whitegray'}>Farms</Button>
  </div>
}
