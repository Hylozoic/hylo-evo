/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { matchPath, Route, Link } from 'react-router-dom'
import SampleCard from 'components/SampleCard'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import cx from 'classnames'
import { get } from 'lodash/fp'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'

import '../../css/global/index.scss'
import p from './component.scss'

export default function PrimaryLayout ({ match, location }) {
  const hasDetail = matchPath(location.pathname, {path: '/events/:eventId'})

  return <div styleName='p.container'>
    <TopNav />
    <div styleName='p.row'>
      <Route path='/' component={Navigation} collapsed={hasDetail} />
      <div styleName='p.content'>
        <Route path='/' exact component={Feed} />
        <Route path='/events' component={Events} />
      </div>
      <div styleName={cx('p.sidebar', {hidden: hasDetail})}>
        <Route path='/' component={Feed} />
      </div>
      <div styleName={cx('p.detail', {hidden: !hasDetail})}>
        {/*
          TODO: Display content of last detail page on '/' so that the
          animation transitions correctly.
          Best guess is to replace these routes with a render function
          defined above, and store the previous detail component in state
        */}
        <Route path='/events/:eventId' exact component={EventDetail} />
      </div>
    </div>
  </div>
}
