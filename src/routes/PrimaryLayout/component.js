/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { matchPath, Route, Link } from 'react-router-dom'
import SampleCard from 'components/SampleCard'
import Navigation from './components/Navigation'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'

// Global styles
import 'css/global/index.scss'

export default function PrimaryLayout ({ match, location }) {
  // TODO: Replace with something more sensible 
  const hasDetail = location.pathname.match(/\/events\//)
  return <div styleName='container'>
    <div styleName='row'>
      <div styleName='header' className='hdr-display'>
        <Route path='/' component={Header} />
      </div>
    </div>
    <div styleName='row'>
      <Navigation collapsed={hasDetail} />
      <div styleName='content'>
        <Route path='/' exact component={SampleCard} />
        <Route path='/events' component={Events} />
      </div>
      <div styleName={hasDetail ? 'detail-expanded' : 'detail'}>
        <Route path='/' exact component={SampleCard} />
        <Route path='/events/:eventId' exact component={EventDetail} />
      </div>
    </div>
  </div>
}

export function Header () {
  return <div className='hdr-display'>Top Bar</div>
}
