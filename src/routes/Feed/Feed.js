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
    const { topicName, fetchTopic } = this.props
    if (topicName) fetchTopic()
  }

  componentDidUpdate (prevProps) {
    const { communitySlug, topicName, fetchTopic } = this.props
    const topicChanged = topicName && get('topicName', prevProps) !== topicName
    const slugChanged = communitySlug && get('communitySlug', prevProps) !== communitySlug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
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
    const {
      topic, community, currentUser, topicName, postsTotal, followersTotal,
      communityTopic
    } = this.props

    if (topicName && !topic) return <Loading />
    if (community && topicName && !communityTopic) return <Loading />

    return <div styleName='container'>
      {topicName
        ? <TopicFeedHeader
          communityTopic={communityTopic}
          topicName={topicName}
          postsTotal={postsTotal}
          followersTotal={followersTotal}
          topic={topic}
          community={community} />
        : <FeedBanner community={community} currentUser={currentUser}
          all={!community} />}
      <FeedList {...this.getFeedProps()} />
    </div>
  }
}
