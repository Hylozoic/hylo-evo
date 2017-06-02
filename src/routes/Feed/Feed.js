import React, { Component, PropTypes } from 'react'
import './Feed.scss'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { ALL_COMMUNITIES_ID } from 'components/FeedList/FeedList.store'
import { FEED_HEADER_ID } from 'util/scrolling'
import { get, pick } from 'lodash/fp'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      feedHeaderHeight: 0
    }
  }

  componentDidMount () {
    const { topicName, fetchTopic } = this.props
    if (topicName) fetchTopic()
  }

  headerMounted = () => {
    const header = document && document.getElementById(FEED_HEADER_ID)
    const height = header && header.offsetHeight
    height && this.setState({feedHeaderHeight: height})
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
      feedHeaderHeight: this.state.feedHeaderHeight,
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
      communityTopic, newPost
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
          community={community}
          ref={this.headerMounted} />
        : <FeedBanner community={community} currentUser={currentUser}
          all={!community} newPost={newPost} ref={this.headerMounted} />}
      <FeedList {...this.getFeedProps()} />
    </div>
  }
}
