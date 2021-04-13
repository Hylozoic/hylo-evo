import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import './OffersAndRequestsWidget.scss'

const { array, object } = PropTypes

export default class OffersAndRequestsWidget extends Component {
  static propTypes = {
    group: object,
    offersAndRequests: array
  }

  render () {
    const { group, offersAndRequests } = this.props

    return (
      <div styleName='offers-and-requests'>
        {offersAndRequests && offersAndRequests.map(p => <Link to={postUrl(p.id, { groupSlug: group.slug })} key={p.id}>
          <div styleName='item'>
            <div styleName='meta'>
              <span styleName='type'>{p.type}</span> from {p.creator.name}
              <span styleName={cx('num-comments', p.type)}>{p.commentsTotal} <div styleName='tail' /></span>
            </div>
            <div styleName='title'>{p.title}</div>
            <RoundImage url={p.creator.avatarUrl} styleName='author-image' />
          </div>
        </Link>)}
      </div>
    )
  }
}
