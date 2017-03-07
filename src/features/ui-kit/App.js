/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'

// Insert Global CSS
import './css/global.scss'

import styles from './App.scss'

class App extends Component {
  render () {
    return (
      (
        <div>
          <div styleName='nav' className='d-flex flex-row justify-content-between align-items-center'>
            <ul styleName='menu'>
              <li styleName='menu_item'><Link to='/typography'>Typography</Link></li>
              <li styleName='menu_item'><Link to='/elements'>Elements</Link></li>
              <li styleName='menu_item'><Link to='/post-types'>Post Types</Link></li>
            </ul>
            <div styleName='heading'>hylo-ui-kit</div>
          </div>
          {this.props.children}
        </div>
      )
    )
  }
}

export default CSSModules(styles, {allowMultiple: true})(App)
