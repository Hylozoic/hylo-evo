/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link, Route } from 'react-router-dom'
import Typography from './Typography'
import Elements from './Elements'
import PostTypes from './PostTypes'

// Insert Global CSS
import './css/global.scss'

import styles from './component.scss'

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
          <Route path='/ui-kit' exact component={Typography} />
          <Route path='/ui-kit/typography' component={Typography} />
          <Route path='/ui-kit/elements' component={Elements} />
          <Route path='/ui-kit/post-types' component={PostTypes} />
        </div>
      )
    )
  }
}

export default CSSModules(styles, {allowMultiple: true})(UIKit)
