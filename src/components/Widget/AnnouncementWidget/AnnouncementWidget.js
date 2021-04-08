import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './AnnouncementWidget.scss'

const { array } = PropTypes

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.1,
  arrows: true,
  slidesToScroll: 1
}

export default class AnnouncementWidget extends Component {
  static propTypes = {
    announcements: array
  }

  render () {
    const { announcements = [] } = this.props

    return (
      <div styleName='announcements'>
        <Slider {...settings}>
          {announcements.map(a => <div styleName={cx('announcement', { narrow: announcements.length > 1 })} key={a.author + '-' + a.title}>
            <Link to='#'>
              <div styleName='content'>
                <div>
                  <div styleName='meta'>
                    <span styleName='author'>{a.author}</span>
                    <span styleName='created'>{a.created}</span>
                  </div>
                  <div styleName='title'>{a.title}</div>
                </div>
              </div>
            </Link>
            <div styleName='background' style={{ backgroundImage: `url(${a.image})` }} />
          </div>)}
        </Slider>
      </div>
    )
  }
}
