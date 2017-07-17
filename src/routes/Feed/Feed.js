import React, { Component, PropTypes } from 'react'
import './Feed.scss'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { get, pick } from 'lodash/fp'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func
  }

  componentDidMount () {
    const { topicName, fetchTopic, networkSlug, fetchNetwork } = this.props
    if (topicName) fetchTopic()
    if (networkSlug) fetchNetwork()
  }

  componentDidUpdate (prevProps) {
    const { communitySlug, topicName, fetchTopic, networkSlug, fetchNetwork } = this.props
    const topicChanged = topicName && get('topicName', prevProps) !== topicName
    const slugChanged = communitySlug && get('communitySlug', prevProps) !== communitySlug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
    if (networkSlug && networkSlug !== prevProps.networkSlug) fetchNetwork()
  }

  getFeedProps () {
    const { communitySlug, topic, networkSlug } = this.props

    var subject

    if (communitySlug) {
      subject = 'community'
    } else if (networkSlug) {
      subject = 'network'
    } else {
      subject = 'all-communities'
    }

    return {
      subject,
      slug: communitySlug,
      networkSlug,
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
      communityTopic, newPost, network, networkSlug
    } = this.props

    if (topicName && !topic) return <Loading />
    if (community && topicName && !communityTopic) return <Loading />

    return <div>
      {topicName
        ? <TopicFeedHeader
          communityTopic={communityTopic}
          topicName={topicName}
          postsTotal={postsTotal}
          followersTotal={followersTotal}
          topic={topic}
          community={community} />
        : <FeedBanner community={community || network} currentUser={currentUser}
          all={!community && !networkSlug} newPost={newPost} />}
      <FeedList {...this.getFeedProps()} />
    </div>
  }
}
