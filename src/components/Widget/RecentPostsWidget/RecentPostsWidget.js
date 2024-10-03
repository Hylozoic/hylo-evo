import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { filter, isEmpty } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { groupUrl, postUrl, createPostUrl } from 'util/navigation'
import classes from './RecentPostsWidget.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const settings = {
  dots: true, // if less than 3 false
  speed: 500,
  infinite: false,
  slidesToShow: 3.5, // If 1 show 1, if 2 show 2, if 3 show 3, if > 3 show 3.5
  slidesToScroll: 3, // if 1 scroll 1, if 2 show 2, if 3 show 3
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 2
      }
    }, {
      breakpoint: 425,
      settings: {
        dots: false,
        slidesToShow: 1.5,
        slidesToScroll: 1
      }
    }
  ]
}

const RecentPostsWidget = ({ group, items, routeParams }) => {
  const [swiped, setSwiped] = useState(false)
  const { t } = useTranslation()

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
    <div className={classes.recentPosts}>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(p => <RecentPostCard key={p.id} post={p} group={group} onClickCapture={handleOnItemClick} routeParams={routeParams} />)}
        <div>
          <Link to={createPostUrl(routeParams)} className={cx(classes.post, classes.createNew)}>
            <div className={classes.content}>
              <div className={classes.type}>{t('NO MORE RECENT ACTIVITY')}</div>
              <div className={classes.recentPostsCta}>{t('+ New post')}</div>
            </div>
          </Link>
        </div>
        <div className={classes.viewAll}>
          <Link to={groupUrl(group.slug, 'stream')}>{t('View all')}</Link>
        </div>
      </Slider>
    </div>
  )
}

const RecentPostCard = ({ group, onClickCapture, post, routeParams }) => {
  const { commentersTotal, creator, id, title, type } = post
  const imageAttachments = filter({ type: 'image' }, post.attachments)
  let postBackgroundImage
  if (!isEmpty(imageAttachments)) {
    postBackgroundImage = imageAttachments[0].url
  } else {
    postBackgroundImage = 'none'
  }
  return (
    <div>
      <Link to={postUrl(id, routeParams)} className={cx(classes.post, classes[type])} onClickCapture={onClickCapture}>
        <div className={classes.content}>
          <div className={classes.type}>{type}</div>
          <div className={classes.title}>{title}</div>
        </div>
        <div className={classes.bg} style={bgImageStyle(postBackgroundImage)} />
        <div className={classes.meta}>
          <RoundImage url={creator.avatarUrl} medium withBorder={false} />
          <Icon name='SpeechBubble' className={classes.comments}>
            <span className={classes.commenters}>{commentersTotal}</span>
          </Icon>
        </div>
      </Link>
    </div>
  )
}

export default RecentPostsWidget
