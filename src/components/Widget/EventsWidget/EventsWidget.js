import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './EventsWidget.scss'

const { array } = PropTypes

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
    events: array
  }

  render () {
    const { events } = this.props
    // TODO: Can use the Event component on MemberProfile
    return (
      <div styleName='events'>
        <Slider {...settings}>
          {events && events.map(e => <div styleName={cx('event', { narrow: events.length > 1 })} key={e.id}>
            <Link to='#'>
              <div styleName='content'>
                <div styleName='time'>{e.time}</div>
                <div styleName='title'>{e.title}</div>
                <div styleName='location'>{e.time}</div>
              </div>
            </Link>
            <div styleName='background' style={{ backgroundImage: `url(${e.image})` }} />
          </div>)}
        </Slider>
      </div>
    )
  }
}
