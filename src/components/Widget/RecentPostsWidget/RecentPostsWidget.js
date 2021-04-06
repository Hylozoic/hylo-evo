import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Slider from 'react-slick'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'

import './RecentPostsWidget.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const { array } = PropTypes

export default class RecentPostsWidget extends Component {
  static propTypes = {
    posts: array
  }

  render () {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 3
    }

    const { posts, showDetails } = this.props
    return (
      <div>
        <Slider {...settings}>
          {posts.map(p => <RecentPostCard post={p} showDetails={showDetails} />)}
        </Slider>
      </div>
    )
  }
}

const RecentPostCard = ({ post, showDetails }) => {
  const { commentersTotal, creator, id, title, type } = post
  return (
    <div>
      <div styleName={`post ${type}`} onClick={() => showDetails(id)}>
        <div styleName='type'>{type}</div>
        <div styleName='title'>{title}</div>
      </div>
      <div styleName='images'>
        <RoundImage url={creator.avatarUrl} medium withBorder={false} />
        <Icon name='SpeechBubble'><span styleName='commenters'>{commentersTotal}</span></Icon>
      </div>
    </div>
  )
}
