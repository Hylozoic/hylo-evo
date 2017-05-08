import React, { Component } from 'react'
import './CommunityFeed.scss'
import Feed from 'components/Feed'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { get, pick } from 'lodash/fp'

export default class CommunityFeed extends Component {
  componentDidUpdate (prevProps) {
    const { community, topicName, fetchCommunityTopic } = this.props
    const communitySlug = get('slug', community)
    const prevCommunity = get('community', prevProps)
    const prevCommunitySlug = get('slug', prevCommunity)
    if (!prevCommunitySlug && communitySlug) {
      fetchCommunityTopic(topicName, communitySlug)
    }
  }

  render () {
    const { community, currentUser, communityTopic, topicName } = this.props
    const feedProps = {
      subject: 'community',
      id: get('slug', community),
      topic: get('topic.id', communityTopic),
      ...pick([
        'filter',
        'sortBy',
        'changeSort',
        'changeTab',
        'showPostDetails',
        'selectedPostId'
      ], this.props)
    }
    const readyToDisplayFeed = !topicName || (topicName && communityTopic)

    return <div styleName='container'>
      {!topicName && <FeedBanner community={community} currentUser={currentUser} />}
      {communityTopic && <TopicFeedHeader communityTopic={communityTopic} community={community} />}
      {readyToDisplayFeed && <Feed {...feedProps} />}
    </div>
  }
}
