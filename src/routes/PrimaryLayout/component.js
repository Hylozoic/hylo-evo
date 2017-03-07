/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import SampleCard from 'components/SampleCard'

// Global styles
import 'css/global/index.scss'

export default function PrimaryLayout (
  { header, navigation, content }
) {
  const detail = (content && content.props && content.props.detail)
  const expanded = !!detail
  return <div styleName='container'>
    <div styleName='row'>
      <div styleName='header' className='hdr-display'>
        {header || <Header />}
      </div>
    </div>
    <div styleName='row'>
      <div styleName={expanded ? 'navigation-collapsed' : 'navigation'}>
        {navigation || <Navigation />}
      </div>
      <div styleName='content'>
        {content || <SampleCard />}
      </div>
      <div styleName={expanded ? 'detail-expanded' : 'detail'}>
        {detail || <SampleCard />}
      </div>
    </div>
  </div>
}

export function Header () {
  return <div className='hdr-display'>Top Bar</div>
}

export function Navigation () {
  return <ul>
    <li><Link to='/'>Home</Link></li>
    <li><Link to='/events'>Events</Link></li>
    <li><Link to='/ui-kit'>UI Kit</Link></li>
  </ul>
}
