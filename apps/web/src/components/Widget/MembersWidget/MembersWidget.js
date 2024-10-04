import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import Icon from 'components/Icon'
import { groupUrl, messagePersonUrl, personUrl } from 'util/navigation'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import classes from './MembersWidget.module.scss'

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
  const { t } = useTranslation()

  return (
    <div className={classes.activeUsers}>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(m => <div key={m.id} className={classes.activeUser}>
          <div className={classes.userName}>{m.name.split(' ')[0]}</div>
          <div className={classes.userControls}>
            <div className={classes.buttons}>
              <Link to={messagePersonUrl(m)} onClickCapture={handleOnItemClick}>
                <Icon name='Messages' className={classes.userMessageIcon} />
              </Link>
              <Link to={personUrl(m.id, group.slug)} onClickCapture={handleOnItemClick}>
                <Icon name='Person' className={classes.userProfileIcon} />
              </Link>
            </div>
          </div>
          <div className={classes.userBackground} />
          <div className={classes.userImage} style={{ backgroundImage: `url(${m.avatarUrl})` }} />
        </div>)}
        <div className={classes.membersLink}>
          <div>
            <Link to={groupUrl(group.slug, 'members')}>{t('All')}</Link>
          </div>
        </div>
      </Slider>
      <div className={classes.rightFade} />
    </div>
  )
}
