import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import './component.scss'
import Typography from './Typography'
import Elements from './Elements'
import PostTypes from './PostTypes'
import Icons from './Icons'

class UIKit extends Component {
  componentDidMount () {
    // FIXME this doesn't belong here
    //
    // It is currently here for CurrentUser to be loaded in the context
    // of PostTypes > PostEditor for community selection...
    this.props.fetchCurrentUser()
  }

  render () {
    return (
      (
        <div>
          <div styleName='nav'>
            <ul styleName='menu'>
              <li styleName='menu_item'><Link to='/ui-kit/typography'>Typography</Link></li>
              <li styleName='menu_item'><Link to='/ui-kit/elements'>Elements</Link></li>
              <li styleName='menu_item'><Link to='/ui-kit/post-types'>Post Types</Link></li>
              <li styleName='menu_item'><Link to='/ui-kit/icons'>Icons</Link></li>
              <li styleName='menu_item'><Link to='/'>Back to hylo-evo</Link></li>
            </ul>
            <div styleName='heading'>hylo-ui-kit</div>
          </div>
          <Route path='/ui-kit' exact component={Typography} />
          <Route path='/ui-kit/typography' component={Typography} />
          <Route path='/ui-kit/elements' component={Elements} />
          <Route path='/ui-kit/post-types' component={PostTypes} />
          <Route path='/ui-kit/icons' component={Icons} />
        </div>
      )
    )
  }
}

export default UIKit
