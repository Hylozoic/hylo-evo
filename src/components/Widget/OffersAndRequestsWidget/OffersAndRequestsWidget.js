import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import RoundImage from '../../RoundImage'

import './OffersAndRequestsWidget.scss'

const { array } = PropTypes

export default class OffersAndRequestsWidget extends Component {
  static propTypes = {
    offersAndRequests: array
  }

  render () {
    const { offersAndRequests } = this.props
    return (
      <div styleName='offers-and-requests'>
        {offersAndRequests && offersAndRequests.map(a => <Link to='#' key={a.id}>
          <div styleName='item'>
            <div styleName='meta'>
              <span styleName='type'>{a.kind}</span> from {a.author}
              <span styleName={cx('num-comments', a.kind)}>{a.numComments} <div styleName='tail' /></span>
            </div>
            <div styleName='title'>{a.title}</div>
            <RoundImage url={a.avatarUrl} styleName='author-image' />
          </div>
        </Link>)}
      </div>
    )
  }
}
