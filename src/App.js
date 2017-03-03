/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import CardOffer from './components/CardOffer';

// Insert Global CSS
import './css/global.scss'

import styles from './App.scss'

class App extends Component {
  render () {
    return <div styleName='container'>
      <div styleName='row'>
        <div styleName='topBar'>
          Top Bar
        </div>
      </div>
      <div styleName='row'>
        <div styleName='leftPanel'>
          <CardOffer />
          <CardOffer />
          <CardOffer />
        </div>
        <div styleName='centerPanel'>
          <CardOffer />
          <CardOffer />
            {this.props.children}
        </div>
        <div styleName='rightPanel'>
          <CardOffer />
          <CardOffer />
          <CardOffer />
          <CardOffer />
        </div>
      </div>
    </div>
  }
}

export default CSSModules(styles, {allowMultiple: true})(App)
