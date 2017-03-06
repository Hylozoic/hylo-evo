/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import CardOffer from 'components/CardOffer'

// Insert Global CSS
import 'css/global/index.scss'

import styles from 'App.scss'

class App extends Component {
  render () {
    const { main, sidebar, detail } = this.props
    const expanded = !!detail

    return <div styleName='container'>
      <div styleName='row'>
        <div styleName='topBar' className='hdr-display'>
          Top Bar
        </div>
      </div>
      <div styleName='row'>
        <div styleName={expanded ? 'leftPanel-collapsed' : 'leftPanel'}>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/events'>Events</Link></li>
          </ul>
        </div>
        <div styleName='centerPanel'>
          {main}
        </div>
        <div styleName={expanded ? 'rightPanel-expanded' : 'rightPanel'}>
          {sidebar || detail}
        </div>
      </div>
    </div>
  }
}

export default CSSModules(styles, {allowMultiple: true})(App)
