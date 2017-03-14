/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import SampleCard from 'components/SampleCard'
import Navigation from './components/Navigation'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'

// Global styles
import 'css/global/index.scss'

export default function PrimaryLayout ({ match }) {
  const hasDetail = !!match.params.eventId
  return <div styleName='container'>
    <div styleName='row'>
      <div styleName='header' className='hdr-display'>
        <Route path='/' exact component={Header} />
      </div>
    </div>
    <div styleName='row'>
      <Navigation collapsed={hasDetail} />
      <div styleName='content'>
        <Route path='/' component={SampleCard} />
        <Route path='/events' exact component={Events} />
      </div>
      <div styleName={hasDetail ? 'detail-expanded' : 'detail'}>
        <Route path='/' component={SampleCard} />
        <Route path='/events/:eventId' component={EventDetail} />
      </div>
    </div>
  </div>
}

export function Header () {
  return <div className='hdr-display'>Top Bar</div>
}
