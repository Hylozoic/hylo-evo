/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'

// Insert Global CSS
import './css/global.scss'

import styles from './App.scss'

class App extends Component {
  render () {
    return <div styleName='container'>
      <div className='row'>
        <div styleName='leftPanel'>
          stuff here in column 1
          {this.props.children}
        </div>
        <div styleName='centerPanel'>
          tests
        </div>
        <div styleName='rightPanel'>
          stuff here in column 2
          {this.props.children}
        </div>
      </div>
    </div>
  }
}

export default CSSModules(styles, {allowMultiple: true})(App)
