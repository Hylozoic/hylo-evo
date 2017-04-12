import { capitalize } from 'lodash/fp'
import React from 'react'

import './SimpleTabBar.scss'

export default class TabBar extends React.Component {
  static defaultProps = {
    onChange: settings => console.log('Tab Bar changed: ', settings)
  }

  render () {
    const { currentTab, tabNames, onChange } = this.props

    return <ul styleName='tab-bar'>
      {tabNames.map(name => <li
        key={name}
        styleName={name === currentTab ? 'tab-active' : 'tab'}
        onClick={() => onChange({ tab: name })}
        >{ capitalize(name) }</li>)}
    </ul>
  }
}
