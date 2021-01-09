import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { PostPrompt } from 'components/FeedBanner/FeedBanner'
import { inflectedTotal, bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Group'

import './TopicFeedHeader.scss'

const { string, number, object, shape, func } = PropTypes

export default function TopicFeedHeader ({
  topic,
  postsTotal,
  followersTotal,
  group,
  groupTopic,
  toggleSubscribe,
  currentUser,
  newPost,
  type
}) {
  const bannerUrl = get('bannerUrl', group)
  let buttonText, iconStyle, buttonStyle
  if (group) {
    buttonText = groupTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'
    iconStyle = groupTopic.isSubscribed ? 'subscribe-star-icon-green' : 'subscribe-star-icon'
    buttonStyle = groupTopic.isSubscribed ? 'unsubscribe' : 'subscribe'
  }
  postsTotal = postsTotal || 0
  followersTotal = followersTotal || 0

  return <div styleName='topic-feed-header'>
    <div styleName='fade'><div styleName='fade2' /></div>
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
      <div styleName='topic-name'>#{topic.name}</div>
      <div styleName='meta'>
        <Icon name='Star' styleName='star-icon' />
        {inflectedTotal('subscriber', followersTotal)}
        <Icon name='Post' styleName='post-icon' />
        {inflectedTotal('post', postsTotal)}
      </div>
      {group && <Button styleName={buttonStyle} onClick={toggleSubscribe}>
        <Icon name='Star' styleName={iconStyle} />{buttonText}
      </Button>}
      <PostPrompt
        firstName={currentUser.firstName()}
        type={type}
        avatarUrl={currentUser.avatarUrl}
        newPost={newPost} />
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
  group: shape({
    id: string,
    name: string,
    slug: string
  })
}
