/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'
import CardOffer from 'components/CardOffer'

import 'css/global/index.scss'

export default function GeneralLayout (
  { header, navigation, content, detail }
) {
  const expanded = !!detail
  return <div styleName='container'>
    <div styleName='row'>
      <div styleName='header' className='hdr-display'>
        {header || 'Top Bar'}
      </div>
    </div>
    <div styleName='row'>
      <div styleName={expanded ? 'navigation-collapsed' : 'navigation'}>
        {navigation || <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/events'>Events</Link></li>
        </ul>}
      </div>
      <div styleName='content'>
        {content || <CardOffer />}
      </div>
      <div styleName={expanded ? 'detail-expanded' : 'detail'}>
        {detail || <CardOffer />}
      </div>
    </div>
  </div>
}
