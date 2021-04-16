import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { createGroupUrl, groupUrl, groupDetailUrl } from 'util/navigation'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './GroupsWidget.scss'

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

export default class GroupsWidget extends Component {
  static propTypes = {
    group: object,
    items: array
  }

  render () {
    const { items = [], routeParams } = this.props

    return (
      <div styleName='groups'>
        <Slider {...sliderSettings}>
          {items && items.map(g => <div styleName='group' key={g.id}>
            <div>
              <div styleName='content'>
                <div styleName='group-avatar'><img src={g.avatarUrl} /></div>
                <div styleName='group-name'>{g.name}</div>
                <div styleName='member-count'>{g.memberCount} member{g.memberCount !== 1 ? 's' : ''}</div>
                <div styleName='group-description'>
                  {g.description}
                  {g.description && g.description.length > 140 && <div styleName='descriptionFade' />}
                </div>
                {g.memberStatus === 'member'
                  ? <div styleName='is-member'><Link to={groupUrl(g.slug)}><span>Member</span><span styleName='visit'>Visit</span></Link></div>
                  : g.memberStatus === 'requested'
                    ? <div styleName='isnt-member'><Link to={groupDetailUrl(g.slug, routeParams)}><span>Pending</span><span styleName='visit'>View</span></Link></div>
                    : <div styleName='isnt-member'><Link to={groupDetailUrl(g.slug, routeParams)}><span>View</span><span styleName='visit'>View</span></Link></div>
                }
              </div>
            </div>
            <div styleName='background' style={{ backgroundImage: `url(${g.bannerUrl})` }} ><div styleName='fade' /></div>
          </div>)}
          <div styleName='createGroup'>
            <div>
              <Link to={createGroupUrl(routeParams)}>+ Create Group</Link>
            </div>
          </div>
        </Slider>
        <div styleName='groupBumper' />
      </div>
    )
  }
}
