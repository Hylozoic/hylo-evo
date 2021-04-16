import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Icon from 'components/Icon'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl, createPostUrl } from 'util/navigation'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './EventsWidget.scss'

const { array, object } = PropTypes

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.1,
  arrows: true,
  slidesToScroll: 1
}

export default class EventsWidget extends Component {
  static propTypes = {
    group: object,
    items: array
  }

  render () {
    const { items, group, routeParams } = this.props
    return (
      <div styleName='events'>
        <Slider {...settings}>
          {items.map(e => <div styleName={cx('event', { narrow: items.length > 1 })} key={e.id}>
            <Link to={postUrl(e.id, { groupSlug: group.slug })}>
              <div styleName='content'>
                <div styleName='time'>{moment(e.startTime).format('MMM D YYYY')}</div>
                <div styleName='title'>{e.title}</div>
                <div styleName='location'>{e.location}</div>
              </div>
            </Link>
            <div styleName='background' style={{ backgroundImage: `url(${e.primaryImage || '/default-event.png'})` }} />
          </div>)}
          <div styleName='event create-new'>
            <div styleName='events-cta'>
              <Link to={createPostUrl(routeParams, { newPostType: 'event' })}>
                <Icon name='Calendar' styleName='event-icon' />
                <h4>Bring your group together</h4>
                <p>What you will do at your next event?</p>
                <div styleName='button'>+ Create an event</div>
              </Link>
            </div>
          </div>
        </Slider>
      </div>
    )
  }
}
