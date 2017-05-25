import React, { Component, PropTypes } from 'react'
import './Feed.scss'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import { get, pick } from 'lodash/fp'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func
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
        'selectedPostId',
        'editPost'
      ], this.props)
    }
  }

  render () {
    const {
      topic, communitySlug, community, currentUser,
      topicName, postsTotal, followersTotal, newPost
    } = this.props

    if (communitySlug && !community) return <Loading />

    return <div styleName='container'>
      {!topicName && <FeedBanner
        community={community}
        currentUser={currentUser}
        newPost={newPost}
        all={!community} />}
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
