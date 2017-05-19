import React, { Component } from 'react'
import './Feed.scss'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import { get, pick } from 'lodash/fp'

export default class Feed extends Component {
  static propTypes = {

  }

  componentDidMount () {
    const { communitySlug, topicName, fetchTopic, fetchCommunityTopic } = this.props
    if (communitySlug && topicName) fetchCommunityTopic()
    else if (topicName) fetchTopic()
  }

  componentDidUpdate (prevProps) {
    const { communitySlug, topicName, fetchCommunityTopic, fetchTopic } = this.props
    const prevTopicName = get('topicName', prevProps)
    if (communitySlug && topicName &&
        (topicName !== prevTopicName || get('communitySlug', prevProps) !== communitySlug)) {
      fetchCommunityTopic()
    } else if (topicName && topicName !== prevTopicName) {
      fetchTopic()
    }
  }

  getFeedProps () {
    const { communitySlug, topic } = this.props
    return {
      subject: communitySlug ? 'community' : 'all-communities',
      id: communitySlug || ALL_COMMUNITIES_ID,
      topic: get('id', topic),
      showCommunities: !communitySlug,
      ...pick([
        'filter',
        'sortBy',
        'changeSort',
        'changeTab',
        'showPostDetails',
        'selectedPostId'
      ], this.props)
    }
  }

  render () {
    const { topic, communitySlug, community, currentUser, topicName, postsTotal, followersTotal } = this.props
    if (communitySlug && !community) return <Loading />

    return <div styleName='container'>
      {!topicName && <FeedBanner community={community} currentUser={currentUser} all={!community} />}
      {topicName && <TopicFeedHeader
        topicName={topicName}
        postsTotal={postsTotal}
        followersTotal={followersTotal}
        topic={topic}
        community={community} />}
      <FeedList {...this.getFeedProps()} />
    </div>
  }
}
