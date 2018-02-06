import PropTypes from 'prop-types'
import React from 'react'
import { get } from 'lodash/fp'
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
  postsTotal = postsTotal || 0
  followersTotal = followersTotal || 0
  return <div styleName='topic-feed-header'>
    <div style={bgImageStyle(bannerUrl || DEFAULT_BANNER)} styleName='image'>
      <div styleName='topic-name'>#{topic.name}</div>
      <div styleName='meta'>
        {pluralize(followersTotal, 'subscriber')} {pluralize(postsTotal, 'post')}
      </div>
      {community && <Button styleName='subscribe' onClick={toggleSubscribe}>
        {communityTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
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
