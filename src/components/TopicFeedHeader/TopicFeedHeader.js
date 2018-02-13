import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { PostPrompt } from 'components/FeedBanner/FeedBanner'
import { pluralize, bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Community'

import './TopicFeedHeader.scss'

const { string, number, object, shape, func } = PropTypes

export default function TopicFeedHeader ({
  topic,
  postsTotal,
  followersTotal,
  community,
  communityTopic,
  toggleSubscribe,
  currentUser,
  newPost
}) {
  const bannerUrl = get('bannerUrl', community)
  const buttonText = communityTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'
  const iconStyle = communityTopic.isSubscribed ? 'subscribe-star-icon-green' : 'subscribe-star-icon'
  const buttonStyle = communityTopic.isSubscribed ? 'unsubscribe' : 'subscribe'

  postsTotal = postsTotal || 0
  followersTotal = followersTotal || 0
  return <div styleName='topic-feed-header'>
    <div styleName='fade'><div styleName='fade2' /></div>
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
      <div styleName='topic-name'>#{topic.name}</div>
      <div styleName='meta'>
        <Icon name='Star' styleName='star-icon' />
        {pluralize(followersTotal, 'subscriber')}
        <Icon name='Post' styleName='post-icon' />
        {pluralize(postsTotal, 'post')}
      </div>
      {community && <Button styleName={buttonStyle} onClick={toggleSubscribe}>
        <Icon name='Star' styleName={iconStyle} />{buttonText}
      </Button>}
      <PostPrompt currentUser={currentUser} newPost={newPost} />
    </div>
  </div>
}
TopicFeedHeader.propTypes = {
  subscription: object,
  toggleSubscribe: func,
  topicName: string,
  postsTotal: number,
  followersTotal: number,
  topic: shape({
    id: string,
    name: string
  }).isRequired,
  community: shape({
    id: string,
    name: string,
    slug: string
  })
}
