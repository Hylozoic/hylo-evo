import cx from 'classnames'
import { get, isEmpty } from 'lodash/fp'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Dropdown from 'components/Dropdown'
import GroupBanner from 'components/GroupBanner'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import fetchPosts from 'store/actions/fetchPosts'
import { FETCH_POSTS, FETCH_FOR_CURRENT_USER } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { getHasMorePosts, getPosts } from 'store/selectors/getPosts'
import { createPostUrl } from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import { updateTimeframe } from './Events.store'

import s from './Events.module.scss'
import viewStyles from '../../components/StreamViewControls/StreamViewControls.module.scss'

function Events (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const routeParams = useParams()
  const location = useLocation()

  const currentUser = useSelector(getMe)
  const currentUserHasMemberships = !isEmpty(useSelector(getMyMemberships))
  const groupSlug = routeParams.groupSlug
  const childPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'
  const group = useSelector(state => getGroupForSlug(state, groupSlug))
  const timeframe = useSelector(state => state.Events.timeframe)
  const context = props.context

  const fetchPostsParam = {
    childPostInclusion,
    afterTime: timeframe === 'future' ? new Date().toISOString() : null,
    beforeTime: timeframe === 'past' ? new Date().toISOString() : null,
    context,
    filter: 'event',
    order: timeframe === 'future' ? 'asc' : 'desc',
    slug: groupSlug,
    sortBy: 'start_time'
  }

  const posts = useSelector(state => getPosts(state, fetchPostsParam).map(p => presentPost(p, get('id', group))))
  const hasMore = useSelector(state => getHasMorePosts(state, fetchPostsParam))
  const membershipsPending = useSelector(state => state.pending[FETCH_FOR_CURRENT_USER])
  const pending = useSelector(state => state.pending[FETCH_POSTS])

  const fetchEvents = (offset) => dispatch(fetchPosts({ offset, ...fetchPostsParam }))
  const updateTimeframeAction = (newTimeframe) => dispatch(updateTimeframe(newTimeframe))
  const newPost = () => navigate(createPostUrl(routeParams, { newPostType: 'event' }))

  useEffect(() => {
    fetchEvents()
  }, [context, groupSlug, timeframe])

  const fetchMoreEvents = () => {
    if (pending || posts.length === 0 || !hasMore) return
    fetchEvents(posts.length)
  }

  const timeframeOptions = [
    { id: 'future', label: t('Upcoming Events') },
    { id: 'past', label: t('Past Events') }
  ]
  const upcomingText = t('upcoming')
  const pastText = t('past')

  if (!currentUser) return <Loading />
  if (membershipsPending) return <Loading />

  return (
    <div>
      <Helmet>
        <title>Events | {group ? `${group.name} |` : ''}Hylo</title>
      </Helmet>

      <GroupBanner
        group={group}
        currentUser={currentUser}
        type='event'
        context={context}
        newPost={newPost}
        routeParams={routeParams}
        querystringParams={location.search}
        currentUserHasMemberships={currentUserHasMemberships}
        icon='Events'
        label={t('Events')}
      />
      <div className={viewStyles.streamViewContainer}>
        <div className={viewStyles.streamViewCtrls}>
          <Dropdown
            className={viewStyles.dropdown}
            toggleChildren={
              <span className={viewStyles.dropdownLabel}>
                <Icon name='ArrowDown' />
                {timeframeOptions.find(o => o.id === timeframe).label}
              </span>
            }
            items={timeframeOptions.map(({ id, label }) => ({
              label,
              onClick: () => updateTimeframeAction(id)
            }))}
          />
        </div>
      </div>

      {pending && <Loading />}
      <div className={cx(s.eventsStream, { [s.collapsedState]: false })}>
        {!pending && posts.length === 0 ? <NoPosts message={t('No {{timeFrame}} events', { timeFrame: timeframe === 'future' ? upcomingText : pastText })} /> : ''}

        {posts.map(post => {
          const expanded = post.id === routeParams.postId
          const groupSlugs = post.groups.map(group => group.slug)
          return (
            <PostCard
              childPost={!groupSlugs.includes(groupSlug)}
              routeParams={routeParams}
              post={post}
              className={cx(s.eventCard, { [s.expanded]: expanded })}
              expanded={expanded}
              key={post.id}
            />
          )
        })}
      </div>
      <ScrollListener onBottom={fetchMoreEvents} elementId={CENTER_COLUMN_ID} />
    </div>
  )
}

export default Events
