import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { postUrl, createPostUrl } from 'util/navigation'
import RoundImage from '../../RoundImage'

import classes from './OffersAndRequestsWidget.module.scss'

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
      <div className={classes.offersAndRequests}>
        {items.map(p => <Link to={postUrl(p.id, routeParams)} key={p.id}>
          <div className={classes.item}>
            <div className={classes.meta}>
              <span className={classes.type}>{t(p.type)}</span>{' '}{t('from')}{' '}{p.creator.name}
              <span className={cx(classes.numComments, classes[p.type])}>{p.commentsTotal} <div className={classes.tail} /></span>
            </div>
            <div className={classes.title}>{p.title}</div>
            <RoundImage url={p.creator.avatarUrl} className={classes.authorImage} />
          </div>
        </Link>)}
        {items.length < 3 && isMember ? <div className={cx(classes.item, classes.createOfferRequest)}>
          <div className={classes.meta}>
            <span className={classes.type}>{t('Create a request or offer!')}</span>
          </div>
          <div className={classes.title}>{t('What do you need? What are you offering?')}</div>
          <div className={classes.askOfferCta}>
            <Link to={createPostUrl(routeParams, { newPostType: 'offer' })} className={classes.offerLink}>{t('+ New')} <span className={classes.offer}>{t('Offer')}</span></Link>
            <Link to={createPostUrl(routeParams, { newPostType: 'request' })} className={classes.requestLink}>{t('+ New')} <span className={classes.request}>{t('Request')}</span></Link>
          </div>
          <RoundImage url='/gift.png' className={classes.authorImage} />
        </div> : ' '}
      </div>
    )
  }
}

export default withTranslation()(OffersAndRequestsWidget)
