import moment from 'moment-timezone'
import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl } from 'util/navigation'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import classes from './AnnouncementWidget.module.scss'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.1,
  arrows: true,
  slidesToScroll: 1
}

export default ({ items = [], group, routeParams }) => {
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
    <div className={classes.announcements}>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(a => (
          <div className={cx(classes.announcement, { [classes.narrow]: items.length > 1 })} key={a.id}>
            <Link to={postUrl(a.id, routeParams)} onClickCapture={handleOnItemClick}>
              <div className={classes.content}>
                <div>
                  <div className={classes.meta}>
                    <span className={classes.author}>{a.author}</span>
                    <span className={classes.created}>{moment(a.createdAt).fromNow()}</span>
                  </div>
                  <div className={classes.title}>{a.title}</div>
                </div>
              </div>
            </Link>
            <div
              className={classes.background}
              style={{ backgroundImage: `url(${a.primaryImage || '/default-announcement.png'})` }}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}
