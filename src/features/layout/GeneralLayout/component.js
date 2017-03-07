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
        {navigation || <CardOffer />}
      </div>
      <div styleName='content'>
        {content}
      </div>
      <div styleName={expanded ? 'detail-expanded' : 'detail'}>
        {detail}
      </div>
    </div>
  </div>
}
