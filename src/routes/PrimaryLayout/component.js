/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import SampleCard from 'components/SampleCard'
import Navigation from './components/Navigation'
import TopNav from './components/TopNav'
import cx from 'classnames'
import { get } from 'lodash/fp'

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
    const { header, content, navigation, sidebar } = this.props
    const detail = (content && content.props && content.props.detail)
    const { lastDetail } = this.state
    const expanded = !!detail
    return <div styleName='container'>
      {header || <TopNav />}
      <div styleName='row'>
        {navigation || <Navigation collapsed={expanded} />}
        <div styleName='content'>
          {content || <SampleCard />}
        </div>
        <div styleName={cx('sidebar', {hidden: expanded})}>
          {sidebar || <SampleCard />}
        </div>
        <div styleName={cx('detail', {hidden: !expanded})}>
          {detail || lastDetail || <SampleCard />}
        </div>
      </div>
    </div>
  }
}
