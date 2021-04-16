import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { groupUrl, postUrl, createPostUrl } from 'util/navigation'
import './RecentPostsWidget.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const { array } = PropTypes

export default class RecentPostsWidget extends Component {
  static propTypes = {
    items: array
  }

  render () {
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

    const { group, items, routeParams } = this.props
    return (
      <div styleName='recent-posts'>
        <Slider {...settings}>
          {items.map(p => <RecentPostCard key={p.id} post={p} group={group} />)}
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
}

const RecentPostCard = ({ group, post }) => {
  const { commentersTotal, creator, id, title, type } = post
  return (
    <div>
      <Link to={postUrl(id, { groupSlug: group.slug })} styleName={`post ${type}`}>
        <div styleName='content'>
          <div styleName='type'>{type}</div>
          <div styleName='title'>{title}</div>
        </div>
        <div styleName='bg' style={{ backgroundImage: `url('https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/31786/post/new/2020-12-01_Subcomments_v01.jpg')` }} />
        <div styleName='meta'>
          <RoundImage url={creator.avatarUrl} medium withBorder={false} />
          <Icon name='SpeechBubble' styleName='comments'><span styleName='commenters'>{commentersTotal}</span></Icon>
        </div>
      </Link>
    </div>
  )
}
