import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postUrl, createPostUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import './OffersAndRequestsWidget.scss'

const { array, object } = PropTypes

export default class OffersAndRequestsWidget extends Component {
  static propTypes = {
    group: object,
    items: array
  }

  render () {
    const { group, items, routeParams, isMember } = this.props

    console.log('route', routeParams)
    return (
      <div styleName='offers-and-requests'>
        {items.map(p => <Link to={postUrl(p.id, routeParams)} key={p.id}>
          <div styleName='item'>
            <div styleName='meta'>
              <span styleName='type'>{p.type}</span> from {p.creator.name}
              <span styleName={cx('num-comments', p.type)}>{p.commentsTotal} <div styleName='tail' /></span>
            </div>
            <div styleName='title'>{p.title}</div>
            <RoundImage url={p.creator.avatarUrl} styleName='author-image' />
          </div>
        </Link>)}
        {items.length < 3 && isMember ? <div styleName='item create-offer-request'>
          <div styleName='meta'>
            <span styleName='type'>Create a request or offer!</span>
          </div>
          <div styleName='title'> What do you need? What are you offering?</div>
          <div styleName='ask-offer-cta'>
            <Link to={createPostUrl(routeParams, { newPostType: 'offer' })} styleName='offer-link'>+ New <span styleName='offer'>Offer</span></Link>
            <Link to={createPostUrl(routeParams, { newPostType: 'request' })} styleName='request-link'>+ New <span styleName='request'>Request</span></Link>
          </div>
          <RoundImage url='/gift.png' styleName='author-image' />
        </div> : ' '}
      </div>
    )
  }
}
