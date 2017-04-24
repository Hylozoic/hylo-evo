import { capitalize } from 'lodash/fp'
import React from 'react'

import './SimpleTabBar.scss'

export default function SimpleTabBar ({ currentTab, tabNames, selectTab }) {
  return <ul styleName='tab-bar'>
    {tabNames.map(name =>
      <li key={name}
        styleName={name === currentTab ? 'tab-active' : 'tab'}
        onClick={() => selectTab(name)}>
        {capitalize(name)}
      </li>)}
  </ul>
}
