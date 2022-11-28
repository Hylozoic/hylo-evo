import cx from 'classnames'
import moment from 'moment-timezone'
import React, { useCallback, useState } from 'react'
import Icon from 'components/Icon'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl, createPostUrl } from 'util/navigation'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './EventsWidget.scss'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.1,
  arrows: true,
  slidesToScroll: 1
}

export default ({ items, group, routeParams, isMember }) => {
  const [swiped, setSwiped] = useState(false)

  const handleSwiped = useCallback(() => {
    setSwiped(true)
  }, [setSwiped])

  const handleOnItemClick = useCallback(
    (e) => {
      if (swiped) {
        e.stopPropagation()
        e.preventDefault()
        setSwiped(false)
      }
    },
    [swiped]
  )

  return (
    <div styleName='events'>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(e => <div styleName={cx('event', { narrow: items.length > 1 })} key={e.id}>
          <Link to={postUrl(e.id, routeParams)} onClickCapture={handleOnItemClick}>
            <div styleName='content'>
              <div styleName='time'>{moment(e.startTime).format('MMM D YYYY')}</div>
              <div styleName='title'>{e.title}</div>
              <div styleName='location'>{e.location}</div>
            </div>
          </Link>
          <div styleName='background' style={{ backgroundImage: `url(${e.primaryImage || '/default-event.png'})` }} />
        </div>)}
        {isMember &&
          <div styleName='event create-new'>
            <div styleName='events-cta'>
              <Link to={createPostUrl(routeParams, { newPostType: 'event' })}>
                <Icon name='Calendar' styleName='event-icon' />
                <h4>Bring your group together</h4>
                <p>What you will do at your next event?</p>
                <div styleName='button'>+ Create an event</div>
              </Link>
            </div>
          </div>}
      </Slider>
    </div>
  )
}
