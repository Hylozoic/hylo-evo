import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { postUrl, createPostUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import './OffersAndRequestsWidget.scss'

const { array, bool, object } = PropTypes

class OffersAndRequestsWidget extends Component {
  static propTypes = {
    isMember: bool,
    items: array,
    routeParams: object
  }

  render () {
    const { isMember, items, routeParams, t } = this.props

    return (
      <div styleName='offers-and-requests'>
        {items.map(p => <Link to={postUrl(p.id, routeParams)} key={p.id}>
          <div styleName='item'>
            <div styleName='meta'>
              <span styleName='type'>{t([p.type])}</span>{' '}{t('from')}{' '}{p.creator.name}
              <span styleName={cx('num-comments', p.type)}>{p.commentsTotal} <div styleName='tail' /></span>
            </div>
            <div styleName='title'>{p.title}</div>
            <RoundImage url={p.creator.avatarUrl} styleName='author-image' />
          </div>
        </Link>)}
        {items.length < 3 && isMember ? <div styleName='item create-offer-request'>
          <div styleName='meta'>
            <span styleName='type'>{t('Create a request or offer!')}</span>
          </div>
          <div styleName='title'> {t('What do you need? What are you offering?')}</div>
          <div styleName='ask-offer-cta'>
            <Link to={createPostUrl(routeParams, { newPostType: 'offer' })} styleName='offer-link'>{t('+ New')} <span styleName='offer'>{t('Offer')}</span></Link>
            <Link to={createPostUrl(routeParams, { newPostType: 'request' })} styleName='request-link'>{t('+ New')} <span styleName='request'>{t('Request')}</span></Link>
          </div>
          <RoundImage url='/gift.png' styleName='author-image' />
        </div> : ' '}
      </div>
    )
  }
}

export default withTranslation()(OffersAndRequestsWidget)
