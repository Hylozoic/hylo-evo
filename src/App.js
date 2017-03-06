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
    
    const { main, sidebar } = this.props

    return <div styleName='container'>
      <div styleName='row'>
        <div styleName='topBar' className='hdr-display'>
          Top Bar
        </div>
      </div>
      <div styleName='row'>
        <div styleName='leftPanel'>
          <CardOffer />
          <CardOffer />
          <CardOffer />
        </div>
        {main}
        {sidebar}
      </div>
    </div>
  }
}

export default CSSModules(styles, {allowMultiple: true})(App)
