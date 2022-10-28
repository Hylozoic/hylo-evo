import React, { useCallback, useState } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import { filter, isEmpty } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { groupUrl, postUrl, createPostUrl } from 'util/navigation'
import './RecentPostsWidget.scss'
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

export default ({ group, items, routeParams }) => {
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
    <div styleName='recent-posts'>
      <Slider {...settings} onSwipe={handleSwiped}>
        {items.map(p => <RecentPostCard key={p.id} post={p} group={group} onClickCapture={handleOnItemClick} routeParams={routeParams} />)}
        <div>
          <Link to={createPostUrl(routeParams)} styleName='post create-new'>
            <div styleName='content'>
              <div styleName='type'>NO MORE RECENT ACTIVITY</div>
              <div styleName='recent-posts-cta'>+ New post</div>
            </div>
          </Link>
        </div>
        <div styleName='view-all'>
          <Link to={groupUrl(group.slug, 'stream')}>View all</Link>
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
      <Link to={postUrl(id, routeParams)} styleName={`post ${type}`} onClickCapture={onClickCapture}>
        <div styleName='content'>
          <div styleName='type'>{type}</div>
          <div styleName='title'>{title}</div>
        </div>
        <div styleName='bg' style={bgImageStyle(postBackgroundImage)} />
        <div styleName='meta'>
          <RoundImage url={creator.avatarUrl} medium withBorder={false} />
          <Icon name='SpeechBubble' styleName='comments'><span styleName='commenters'>{commentersTotal}</span></Icon>
        </div>
      </Link>
    </div>
  )
}
