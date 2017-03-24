/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { matchPath, Route, Link } from 'react-router-dom'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import cx from 'classnames'
import { get } from 'lodash/fp'
import Feed from 'routes/Feed'
import Events from 'routes/Events'
import EventDetail from 'routes/Events/EventDetail'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'

import globalStyles from '../../css/global/index.scss' // eslint-disable-line no-unused-vars
import p from './component.scss'

const SAMPLE_USER = {
  id: '1',
  firstName: 'Axolotl',
  lastName: 'Jones',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
}

export default function PrimaryLayout ({ match, location }) {
  const hasDetail = matchPath(location.pathname, {path: '/events/:eventId'})

  return <div styleName='p.container'>
    <TopNav community={SAMPLE_COMMUNITY} currentUser={SAMPLE_USER} />
    <div styleName='p.row'>
      {/* TODO: is using render here the best way to pass params to a route? */}
      <Route path='/' render={() => <Navigation collapsed={hasDetail} location={location} />} />
      <Route path='/' component={Navigation} collapsed={hasDetail} />
      <div styleName='p.content'>
        <Route path='/' exact component={() => <Feed community={SAMPLE_COMMUNITY} currentUser={SAMPLE_USER} />} />
        <Route path='/events' component={Events} />
      </div>
      <div styleName={cx('p.sidebar', {'p.hidden': hasDetail})}>
        <Route path='/' component={Feed} />
      </div>
      <div styleName={cx('p.detail', {'p.hidden': !hasDetail})}>
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
