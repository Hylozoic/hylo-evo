import moment from 'moment'
import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { postUrl } from 'util/navigation'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './AnnouncementWidget.scss'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.1,
  arrows: true,
  slidesToScroll: 1
}

export default ({ items = [], group }) => {
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
    <div styleName='announcements'>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(a => <div styleName={cx('announcement', { narrow: items.length > 1 })} key={a.id}>
          <Link to={postUrl(a.id, { view: 'explore', groupSlug: group.slug })} onClickCapture={handleOnItemClick}>
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
