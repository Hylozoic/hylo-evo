import React from 'react'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { PostPrompt } from 'components/FeedBanner/FeedBanner'
import { inflectedTotal, bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Group'

import './TopicFeedHeader.scss'

export default function TopicFeedHeader ({
  bannerUrl = DEFAULT_BANNER,
  currentUser,
  followersTotal,
  isSubscribed,
  newPost,
  postsTotal,
  toggleSubscribe,
  topic,
  topicName,
  type
}) {
  let buttonText, iconStyle, buttonStyle
  if (toggleSubscribe) {
    buttonText = isSubscribed ? 'Unsubscribe' : 'Subscribe'
    iconStyle = isSubscribed ? 'subscribe-star-icon-green' : 'subscribe-star-icon'
    buttonStyle = isSubscribed ? 'unsubscribe' : 'subscribe'
  }
  postsTotal = postsTotal || 0
  followersTotal = followersTotal || 0

  return <div styleName='topic-feed-header'>
    <div styleName='fade'><div styleName='fade2' /></div>
    <div style={bgImageStyle(bannerUrl)} styleName='image'>
      <div styleName='topic-name'>#{topicName}</div>
      <div styleName='meta'>
        <Icon name='Star' styleName='star-icon' />
        {inflectedTotal('subscriber', followersTotal)}
        <Icon name='Post' styleName='post-icon' />
        {inflectedTotal('post', postsTotal)}
      </div>
      {toggleSubscribe && <Button styleName={buttonStyle} onClick={toggleSubscribe}>
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
