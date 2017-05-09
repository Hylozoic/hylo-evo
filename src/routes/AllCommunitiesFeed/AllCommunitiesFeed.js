import React, { Component } from 'react'
import './AllCommunitiesFeed.scss'
import Feed from 'components/Feed'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { get, pick } from 'lodash/fp'
import { ALL_COMMUNITIES_ID } from 'components/Feed/Feed.store'

export default class AllCommunitiesFeed extends Component {
  componentDidMount () {
    this.props.fetchTopic()
  }

  componentDidUpdate (prevProps) {
    const { topicName, fetchTopic } = this.props
    if (topicName !== get('topicName', prevProps)) {
      fetchTopic()
    }
  }

  render () {
    const { currentUser, topic, topicName } = this.props
    const feedProps = {
      subject: 'all-communities',
      id: ALL_COMMUNITIES_ID,
      topic: get('id', topic),
      showCommunities: true,
      ...pick([
        'filter',
        'sortBy',
        'changeSort',
        'changeTab',
        'showPostDetails',
        'selectedPostId'
      ], this.props)
    }

    return <div styleName='container'>
      {!topicName && <FeedBanner all currentUser={currentUser} />}
      {topicName && <TopicFeedHeader
        postsTotal={get('postsTotal', topic)}
        followersTotal={get('followersTotal', topic)}
        topic={topic}
        topicName={topicName} />}
      <Feed {...feedProps} />
    </div>
  }
}
