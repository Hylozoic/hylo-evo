import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import StreamBanner from 'components/StreamBanner'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import s from './Events.scss'
import viewStyles from '../../components/StreamViewControls/StreamViewControls.scss'

class Events extends Component {
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
    this.props.fetchEvents()
  }

  componentDidUpdate (prevProps) {
    const { routeParams, fetchEvents } = this.props
    const { context, groupSlug } = routeParams

    if ((context && get('routeParams.context', prevProps) !== context) ||
        (groupSlug && get('routeParams.groupSlug', prevProps) !== groupSlug) ||
        prevProps.timeframe !== this.props.timeframe) {
      fetchEvents()
    }
  }

  fetchMoreEvents = () => {
    const { pending, posts, hasMore, fetchEvents } = this.props
    if (pending || posts.length === 0 || !hasMore) return
    fetchEvents(posts.length)
  }

  render () {
    const {
      collapsedState,
      routeParams, querystringParams, group, currentUser,
      newPost, currentUserHasMemberships,
      membershipsPending, pending, posts,
      timeframe, updateTimeframe
    } = this.props
    const timeframeOptions = [
      { id: 'future', label: this.props.t('Upcoming Events') },
      { id: 'past', label: this.props.t('Past Events') }
    ]
    const upcomingText = this.props.t('upcoming')
    const pastText = this.props.t('past')
    const { context } = routeParams

    if (!currentUser) return <Loading />
    if (membershipsPending) return <Loading />

    return (
      <div>
        <StreamBanner
          group={group}
          currentUser={currentUser}
          type='event'
          context={context}
          newPost={newPost}
          routeParams={routeParams}
          querystringParams={querystringParams}
          currentUserHasMemberships={currentUserHasMemberships}
          icon='Events'
          label={this.props.t('Events')}
        />
        <div styleName='viewStyles.stream-view-container'>
          <div styleName='viewStyles.stream-view-ctrls'>
            <Dropdown
              className={viewStyles.dropdown}
              toggleChildren={
                <span styleName='viewStyles.dropdown-label'>
                  <Icon name='ArrowDown' />
                  {timeframeOptions.find(o => o.id === timeframe).label}
                </span>
              }
              items={timeframeOptions.map(({ id, label }) => ({
                label,
                onClick: () => updateTimeframe(id)
              }))}
            />
          </div>
        </div>

        {pending && <Loading />}

        <div styleName={cx('s.events-stream', { [s.collapsedState]: collapsedState })}>
          {!pending && posts.length === 0 ? <NoPosts message={this.props.t(`No {{timeFrame}} events`, { timeFrame: timeframe === 'future' ? upcomingText : pastText })} /> : ''}

          {posts.map(post => {
            const expanded = post.id === routeParams.postId
            return (
              <PostCard
                routeParams={routeParams}
                post={post}
                styleName={cx('s.event-card', { 's.expanded': expanded })}
                expanded={expanded}
                key={post.id}
              />
            )
          })}
        </div>
        <ScrollListener onBottom={this.fetchMoreEvents} elementId={CENTER_COLUMN_ID} />

      </div>
    )
  }
}

export default withTranslation()(Events)
