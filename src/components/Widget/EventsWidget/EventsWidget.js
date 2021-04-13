import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl } from 'util/navigation'

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
    events: array,
    group: object
  }

  render () {
    const { events, group } = this.props
    // TODO: Can use the Event component on MemberProfile?
    return (
      <div styleName='events'>
        <Slider {...settings}>
          {events && events.map(e => <div styleName={cx('event', { narrow: events.length > 1 })} key={e.id}>
            <Link to={postUrl(e.id, { groupSlug: group.slug })}>
              <div styleName='content'>
                <div styleName='time'>{moment(e.startTime).format('MMM D YYYY')}</div>
                <div styleName='title'>{e.title}</div>
                <div styleName='location'>{e.location}</div>
              </div>
            </Link>
            <div styleName='background' style={{ backgroundImage: `url(${e.primaryImage})` }} />
          </div>)}
        </Slider>
      </div>
    )
  }
}
