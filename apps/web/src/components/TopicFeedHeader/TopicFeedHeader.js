import React from 'react'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { inflectedTotal, bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Group'

import classes from './TopicFeedHeader.module.scss'

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

  return <div className={classes.topicFeedHeader}>
    <div style={bgImageStyle(bannerUrl)} className={classes.image}>
      <div className={classes.topicInfo}>
        <div className={classes.topicName}>#{topicName}</div>
        <div className={classes.meta}>
          <Icon name='Star' className={classes.starIcon} />
          {inflectedTotal('subscriber', followersTotal)}
        </div>
      </div>
      {toggleSubscribe && <Button className={cx(classes[buttonStyle])} onClick={toggleSubscribe}>
        <Icon name='Star' className={cx(classes[iconStyle])} />
        <div className={classes.subscribeLabel}>{buttonText}</div>
      </Button>}
      <div className={classes.fade}><div className={classes.fade2} /></div>
    </div>
  </div>
}
