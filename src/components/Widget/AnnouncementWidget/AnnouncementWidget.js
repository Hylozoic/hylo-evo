import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl } from 'util/navigation'
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
    const { announcements = [], group } = this.props

    return (
      <div styleName='announcements'>
        <Slider {...settings}>
          {announcements.map(a => <div styleName={cx('announcement', { narrow: announcements.length > 1 })} key={a.id}>
            <Link to={postUrl(a.id, { groupSlug: group.slug })}>
              <div styleName='content'>
                <div>
                  <div styleName='meta'>
                    <span styleName='author'>{a.author}</span>
                    <span styleName='created'>{moment(a.createdAt).fromNow()}</span>
                  </div>
                  <div styleName='title'>{a.title}</div>
                </div>
              </div>
            </Link>
            <div styleName='background' style={{ backgroundImage: `url(${a.primaryImage || '/default-announcement.png'})` }} />
          </div>)}
        </Slider>
      </div>
    )
  }
}
