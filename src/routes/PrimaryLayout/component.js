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

// Global styles
import 'css/global/index.scss'

export default class PrimaryLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {lastDetail: null}
  }

  componentDidUpdate (prevProps) {
    if (get('content.props.detail', prevProps) && !get('content.props.detail', this.props)) {
      this.setState({lastDetail: get('content.props.detail', prevProps)})
    }
  }

  render () {
    const { match, location } = this.props
    const { lastDetail } = this.state
    // TODO: Replace with something more sensible
    const hasDetail = location.pathname.match(/\/events\//)
    return <div styleName='container'>
      <TopNav />
      <div styleName='row'>
        <Navigation collapsed={hasDetail} />
        <div styleName='content'>
          <Route path='/' exact component={Feed} />
          <Route path='/events' component={Events} />
        </div>
        <div styleName={cx('sidebar', {hidden: hasDetail})}>
          <Route path='/' exact component={Feed} />
          <Route path='/events/:eventId' exact component={EventDetail} />
        </div>
        <div styleName={cx('detail', {hidden: !hasDetail})}>
          <Route path='/' exact component={Feed} />
          <Route path='/events/:eventId' exact component={EventDetail} />
        </div>
      </div>
    </div>
  }
}
