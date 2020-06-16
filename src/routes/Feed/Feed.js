import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { get, pick } from 'lodash/fp'

import './Feed.scss'
import FeedList from 'components/FeedList'
import Loading from 'components/Loading'
import FeedBanner from 'components/FeedBanner'
import TopicFeedHeader from 'components/TopicFeedHeader'
import Button from 'components/Button'
import { bgImageStyle } from 'util/index'

export default class Feed extends Component {
  static propTypes = {
    newPost: PropTypes.func,
    routeParams: PropTypes.object,
    querystringParams: PropTypes.object
  }

  static defaultProps = {
    routeParams: {},
    querystringParams: {}
  }

  componentDidMount () {
    const { routeParams, fetchTopic, fetchNetwork } = this.props
    const { networkSlug, topicName } = routeParams

    if (topicName) fetchTopic()
    if (networkSlug) fetchNetwork()
  }

  componentDidUpdate (prevProps) {
    const { routeParams, fetchTopic, fetchNetwork } = this.props
    const { slug, topicName, networkSlug } = routeParams
    const topicChanged = topicName && get('routeParams.topicName', prevProps) !== topicName
    const slugChanged = slug && get('routeParams.slug', prevProps) !== slug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
    if (networkSlug && networkSlug !== prevProps.routeParams.networkSlug) fetchNetwork()
  }

  getFeedProps () {
    const { routeParams, querystringParams } = this.props
    const { slug, networkSlug, context } = routeParams

    var subject
    if (slug) {
      subject = 'community'
    } else if (networkSlug) {
      subject = 'network'
    } else if (context && context === 'public') {
      subject = 'public-communities'
    } else {
      subject = 'all-communities'
    }

    return {
      subject,
      routeParams,
      querystringParams,
      topic: get('id', this.props.topic),
      ...pick([
        'postTypeFilter',
        'sortBy',
        'changeSort',
        'changeTab',
        'selectedPostId'
      ], this.props)
    }
  }

  render () {
    const {
      routeParams, topic, community, currentUser, postsTotal, followersTotal,
      communityTopic, newPost, network, currentUserHasMemberships,
      goToCreateCommunity, membershipsPending, postTypeFilter
    } = this.props
    const { topicName, context } = routeParams

    if (topicName && !topic) return <Loading />
    if (community && topicName && !communityTopic) return <Loading />
    if (!currentUser) return <Loading />
    if (membershipsPending) return <Loading />

    return <div>
      {topicName
        ? <TopicFeedHeader
          communityTopic={communityTopic}
          topicName={topicName}
          postsTotal={postsTotal}
          followersTotal={followersTotal}
          topic={topic}
          type={postTypeFilter}
          community={community}
          currentUser={currentUser}
          newPost={newPost} />
        : <FeedBanner
          community={community || network}
          currentUser={currentUser}
          type={postTypeFilter}
          all={context && context === 'all'}
          publicContext={context && context === 'public'}
          newPost={newPost}
          currentUserHasMemberships={currentUserHasMemberships} />}
      {currentUserHasMemberships && <FeedList {...this.getFeedProps()} />}
      {!membershipsPending && !currentUserHasMemberships && <CreateCommunityPrompt
        goToCreateCommunity={goToCreateCommunity}
      />}
      {membershipsPending && <Loading />}
    </div>
  }
}

export function CreateCommunityPrompt ({ goToCreateCommunity }) {
  return <div styleName='create-community-prompt'>
    <p>There's no posts yet, try starting a community!</p>
    <Button
      styleName='button'
      label='Create a Community'
      onClick={goToCreateCommunity}
    />
    <div style={bgImageStyle('/assets/hey-axolotl.png')} styleName='sidebar-image' />
  </div>
}
