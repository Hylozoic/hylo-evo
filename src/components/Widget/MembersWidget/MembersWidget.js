import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import Icon from 'components/Icon'
import { groupUrl, messagePersonUrl, personUrl } from 'util/navigation'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './MembersWidget.scss'

const settings = {
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  infinite: false,
  variableWidth: true
}

export default ({ items, group }) => {
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
    <div styleName='active-users'>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(m => <div key={m.id} styleName='active-user'>
          <div styleName='user-name'>{m.name.split(' ')[0]}</div>
          <div styleName='user-controls'>
            <div styleName='buttons'>
              <Link to={messagePersonUrl(m)} onClickCapture={handleOnItemClick}><Icon name='Messages' styleName='user-message-icon' /></Link>
              <Link to={personUrl(m.id, group.slug)} onClickCapture={handleOnItemClick}><Icon name='Person' styleName='user-profile-icon' /></Link>
            </div>
          </div>
          <div styleName='user-background' />
          <div styleName='user-image' style={{ backgroundImage: `url(${m.avatarUrl})` }} />
        </div>)}
        <div styleName='members-link'>
          <div>
            <Link to={groupUrl(group.slug, 'members')}>All</Link>
          </div>
        </div>
      </Slider>
      <div styleName='right-fade' />
    </div>
  )
}
