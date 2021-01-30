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
    const { routeParams, fetchTopic } = this.props
    const { topicName } = routeParams

    if (topicName) fetchTopic()
  }

  componentDidUpdate (prevProps) {
    const { routeParams, fetchTopic } = this.props
    const { groupSlug, topicName } = routeParams
    const topicChanged = topicName && get('routeParams.topicName', prevProps) !== topicName
    const slugChanged = groupSlug && get('routeParams.groupSlug', prevProps) !== groupSlug
    if (topicChanged || (topicName && slugChanged)) fetchTopic()
  }

  getFeedProps () {
    const { routeParams, querystringParams } = this.props
    const { context } = routeParams

    return {
      context,
      routeParams,
      querystringParams,
      topic: get('id', this.props.topic),
      groupId: get('group.id', this.props),
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
      routeParams, topic, group, currentUser, postsTotal, followersTotal,
      groupTopic, newPost, currentUserHasMemberships,
      goToCreateGroup, membershipsPending, postTypeFilter
    } = this.props
    const { topicName, context } = routeParams

    if (topicName && !topic) return <Loading />
    if (group && topicName && !groupTopic) return <Loading />
    if (!currentUser) return <Loading />
    if (membershipsPending) return <Loading />

    return <div>
      {topicName
        ? <TopicFeedHeader
          groupTopic={groupTopic}
          topicName={topicName}
          postsTotal={postsTotal}
          followersTotal={followersTotal}
          topic={topic}
          type={postTypeFilter}
          group={group}
          currentUser={currentUser}
          newPost={newPost} />
        : <FeedBanner
          group={group}
          currentUser={currentUser}
          type={postTypeFilter}
          all={context && context === 'all'}
          publicContext={context && context === 'public'}
          newPost={newPost}
          currentUserHasMemberships={currentUserHasMemberships} />}
      {currentUserHasMemberships && <FeedList {...this.getFeedProps()} />}
      {!membershipsPending && !currentUserHasMemberships && <CreateGroupPrompt
        goToCreateGroup={goToCreateGroup}
      />}
      {membershipsPending && <Loading />}
    </div>
  }
}

export function CreateGroupPrompt ({ goToCreateGroup }) {
  return <div styleName='create-group-prompt'>
    <p>There's no posts yet, try starting a group!</p>
    <Button
      styleName='button'
      label='Create a Group'
      onClick={goToCreateGroup}
    />
    <div style={bgImageStyle('/assets/hey-axolotl.png')} styleName='sidebar-image' />
  </div>
}
