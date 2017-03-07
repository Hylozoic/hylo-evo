/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'

// Insert Global CSS
import './css/global.scss'

import styles from './UIKit.scss'

class UIKit extends Component {
  render () {
    return (
      (
        <div>
          <div styleName='nav' className='d-flex flex-row justify-content-between align-items-center'>
            <ul styleName='menu'>
              <li styleName='menu_item'><Link to='/ui-kit/typography'>Typography</Link></li>
              <li styleName='menu_item'><Link to='/ui-kit/elements'>Elements</Link></li>
              <li styleName='menu_item'><Link to='/ui-kit/post-types'>Post Types</Link></li>
              <li styleName='menu_item'><Link to='/'>Back to hylo-evo</Link></li>
            </ul>
            <div styleName='heading'>hylo-ui-kit</div>
          </div>
          {this.props.children}
        </div>
      )
    )
  }
}

export default CSSModules(styles, {allowMultiple: true})(UIKit)
