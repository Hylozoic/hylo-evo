import React from 'react'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { inflectedTotal, bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Group'

import './TopicFeedHeader.scss'

export default function TopicFeedHeader ({
  bannerUrl = DEFAULT_BANNER,
  currentUser,
  followersTotal,
  groupSlug,
  isSubscribed,
  newPost,
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
  followersTotal = followersTotal || 0

  return <div styleName='topic-feed-header'>
    <div styleName='fade'><div styleName='fade2' /></div>
    <div style={bgImageStyle(bannerUrl)} styleName='image'>
      <div styleName='topic-name'>#{topicName}</div>
      <div styleName='meta'>
        <Icon name='Star' styleName='star-icon' />
        {inflectedTotal('subscriber', followersTotal)}
      </div>
      {toggleSubscribe && <Button styleName={buttonStyle} onClick={toggleSubscribe}>
        <Icon name='Star' styleName={iconStyle} />{buttonText}
      </Button>}
    </div>
  </div>
}
