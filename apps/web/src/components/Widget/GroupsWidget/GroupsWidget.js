import cx from 'classnames'
import React, { Component } from 'react'
import { withTranslation, useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { TextHelpers } from 'hylo-shared'
import { createGroupUrl, groupUrl, groupDetailUrl } from 'util/navigation'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Group'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import classes from './GroupsWidget.module.scss'

const { array, object } = PropTypes

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 2.1,
  arrows: true,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1.1,
        slidesToScroll: 1
      }
    }
  ]
}

class GroupsWidget extends Component {
  static propTypes = {
    group: object,
    items: array,
    routeParams: object
  }

  render () {
    const { items = [], routeParams } = this.props

    return (
      <div className={classes.groups}>
        <Slider {...sliderSettings}>
          {items && items.map(group => <GroupCard key={group.id} group={group} routeParams={routeParams} />)}
          <div className={classes.createGroup}>
            <div>
              <Link to={createGroupUrl(routeParams)}>{this.props.t('+ Create Group')}</Link>
              {/* might have to make this conditional, to suit a wider range of uses */}
            </div>
          </div>
        </Slider>
        <div className={classes.groupBumper} />
      </div>
    )
  }
}

export function GroupCard ({ group, routeParams, className }) {
  const { t } = useTranslation()
  return (
    <div className={cx(classes.group, className)} key={group.id}>
      <div>
        <div className={classes.content}>
          <div className={classes.groupAvatar}><img src={group.avatarUrl || DEFAULT_AVATAR} /></div>
          <div className={classes.groupName}>{group.name}</div>
          <div className={classes.memberCount}>{group.memberCount} {t('member', { count: group.memberCount })}</div>
          <div className={classes.groupDescription}>
            <ClickCatcher>
              <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
            </ClickCatcher>
            {group.description && group.description.length > 140 && <div className={classes.descriptionFade} />}
          </div>
          {group.memberStatus === 'member'
            ? <div className={classes.isMember}><Link to={groupUrl(group.slug)}><span>{t('Member')}</span><span className={classes.visit}>{t('Visit')}</span></Link></div>
            : group.memberStatus === 'requested'
              ? <div className={classes.isntMember}><Link to={groupDetailUrl(group.slug, routeParams)}><span>{t('Pending')}</span><span className={classes.visit}>{t('View')}</span></Link></div>
              : <div className={classes.isntMember}><Link to={groupDetailUrl(group.slug, routeParams)}><span>{t('View')}</span><span className={classes.visit}>{t('View')}</span></Link></div>}
        </div>
      </div>
      <div className={cx(classes.background)} style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}><div className={classes.fade} /></div>
    </div>
  )
}

export default withTranslation()(GroupsWidget)
