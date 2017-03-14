/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import SampleCard from 'components/SampleCard'
import Navigation from './components/Navigation'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'

// Global styles
import 'css/global/index.scss'

export default function PrimaryLayout (
  { header, content, navigation, match }
) {
  const detail = (content && content.props && content.props.detail)
  const expanded = !!detail
  return <Router>
    <div styleName='container'>
      <div styleName='row'>
        <div styleName='header' className='hdr-display'>
          <Route path='/' exact component={Header} />
        </div>
      </div>
      <div styleName='row'>
        {navigation || <Navigation collapsed={expanded} />}
        <div styleName='content'>
          <Route path='/' component={SampleCard} />
          <Route path='/events' exact component={Events} />
        </div>
        <div styleName={expanded ? 'detail-expanded' : 'detail'}>
          <Route path='/' component={SampleCard} />
          <Route path='/events/:eventId' component={EventDetail} />
        </div>
      </div>
    </div>
  </Router>
}

export function Header () {
  return <div className='hdr-display'>Top Bar</div>
}
