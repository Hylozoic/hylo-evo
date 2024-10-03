import cx from 'classnames'
import { get, isEmpty } from 'lodash/fp'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { useParams, useLocation } from 'react-router-dom'
import { push } from 'redux-first-history'
import { createSelector as ormCreateSelector } from 'redux-orm'

import GroupBanner from 'components/GroupBanner'
import Loading from 'components/Loading'
import ModerationListItem from 'components/ModerationListItem/ModerationListItem'
import NoPosts from 'components/NoPosts'
import PostListRow from 'components/PostListRow'
import PostCard from 'components/PostCard'
import PostGridItem from 'components/PostGridItem'
import PostBigGridItem from 'components/PostBigGridItem'
import ScrollListener from 'components/ScrollListener'
import ViewControls from 'components/StreamViewControls'
import TopicFeedHeader from 'components/TopicFeedHeader'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import fetchGroupTopic from 'store/actions/fetchGroupTopic'
import fetchTopic from 'store/actions/fetchTopic'
import fetchPosts from 'store/actions/fetchPosts'
import { fetchModerationActions, clearModerationAction } from 'store/actions/moderationActions'
import respondToEvent from 'store/actions/respondToEvent'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import { FETCH_MODERATION_ACTIONS, FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC, CONTEXT_MY, VIEW_MENTIONS, VIEW_ANNOUNCEMENTS, VIEW_INTERACTIONS, VIEW_POSTS } from 'store/constants'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { getHasMorePosts, getPosts } from 'store/selectors/getPosts'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import { getHasMoreModerationActions, getModerationActions } from 'store/selectors/getModerationActions'
import { createPostUrl } from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'

import styles from './Stream.module.scss'

const viewComponent = {
  cards: PostCard,
  list: PostListRow,
  grid: PostGridItem,
  bigGrid: PostBigGridItem
}

const getCustomView = ormCreateSelector(
  orm,
  (_, customViewId) => customViewId,
  (session, id) => session.CustomView.safeGet({ id })
)

export default function Stream (props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const params = useParams()
  const { groupSlug, topicName, customViewId, postId: selectedPostId } = params
  const context = props.context

  const view = props.view || params.view

  console.log('Stream', context, view)

  const currentUser = useSelector(getMe)
  const currentUserHasMemberships = useSelector(state => !isEmpty(getMyMemberships(state)))
  const group = useSelector(state => getGroupForSlug(state, groupSlug))
  const groupId = group?.id || 0
  const topic = useSelector(state => getTopicForCurrentRoute(state, { match: { params } }))
  const groupTopic = useSelector(state => {
    const gt = getGroupTopicForCurrentRoute(state, { match: { params } })
    return gt && { ...gt.ref, group: gt.group, topic: gt.topic }
  })
  const customView = useSelector(state => getCustomView(state, customViewId))

  const topicLoading = useSelector(state => isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state))
  const isAboutOpen = params.detailGroupSlug

  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const projectsDefault = view === 'projects' ? 'bigGrid' : null
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards'
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined
  const defaultChildPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'

  const querystringParams = getQuerystringParam(['s', 't', 'v', 'c', 'search'], { location })
  const determinePostTypeFilter = () => {
    if (view === 'projects') return 'project'
    if (view === 'proposals') return 'proposal'
    return querystringParams.t || defaultPostType
  }
  const postTypeFilter = determinePostTypeFilter()
  const search = querystringParams.search
  let sortBy = querystringParams.s || customView?.defaultSort || defaultSortBy
  if (!customView && sortBy === 'order') {
    sortBy = 'updated'
  }
  const viewMode = querystringParams.v || customView?.defaultViewMode || projectsDefault || defaultViewMode
  const childPostInclusion = querystringParams.c || defaultChildPostInclusion

  const fetchPostsParam = {
    activePostsOnly: customView?.type === 'stream' ? customView?.activePostsOnly : false,
    childPostInclusion,
    context,
    topicName,
    filter: postTypeFilter,
    forCollection: customView?.type === 'collection' ? customView?.collectionId : null,
    slug: groupSlug,
    search,
    sortBy,
    topic: topic?.id,
    topics: customView?.type === 'stream' ? customView?.topics?.toModelArray().map(t => t.id) : [],
    types: customView?.type === 'stream' ? customView?.postTypes : null
  }

  if (context === CONTEXT_MY && view === VIEW_MENTIONS) fetchPostsParam.mentionsOf = [currentUser.id]
  if (context === CONTEXT_MY && view === VIEW_ANNOUNCEMENTS) fetchPostsParam.announcementsOnly = true
  if (context === CONTEXT_MY && view === VIEW_INTERACTIONS) fetchPostsParam.interactedWithBy = [currentUser.id]
  if (context === CONTEXT_MY && view === VIEW_POSTS) fetchPostsParam.createdBy = [currentUser.id]

  const postsSelector = useSelector((state) => getPosts(state, fetchPostsParam))
  const posts = useMemo(() => postsSelector.map(p => presentPost(p, groupId)), [groupId, postsSelector])
  const hasMore = useSelector(state => getHasMorePosts(state, fetchPostsParam))
  const pending = useSelector(state => state.pending[FETCH_POSTS])
  const pendingModerationActions = useSelector(state => state.pending[FETCH_MODERATION_ACTIONS])

  const decisionView = getQuerystringParam('d', { location }) || 'proposals'
  let moderationActions, hasMoreModerationActions
  const fetchModerationActionParam = {
    slug: groupSlug,
    groupId,
    sortBy
  }
  if (decisionView === 'moderation') {
    moderationActions = getModerationActions(state, fetchModerationActionParam)
    hasMoreModerationActions = getHasMoreModerationActions(state, fetchModerationActionParam)
  }

  const ViewComponent = viewComponent[viewMode]

  useEffect(() => {
    if (topicName) {
      if (groupSlug) {
        dispatch(fetchGroupTopic(topicName, groupSlug))
      } else {
        dispatch(fetchTopic(topicName))
      }
    }
    if (decisionView === 'moderation') {
      fetchModerationActions(0)
    } else {
      fetchPostsFrom(0)
    }
  }, [groupSlug, topicName, postTypeFilter, sortBy, childPostInclusion, context, group?.id, search, customViewId, topic, view])

  const fetchPostsFrom = (offset) => {
    if (pending || hasMore === false) return
    dispatch(fetchPosts({ offset, ...fetchPostsParam }))
  }

  const fetchModerationActions = offset => {
    if (pendingModerationActions || hasMoreModerationActions === false) return
    return dispatch(fetchModerationActions({ offset, ...fetchModerationActionParam }))
  }

  const changeTab = useCallback(tab => {
    dispatch(updateUserSettings({ settings: { streamPostType: tab || '' } }))
    dispatch(changeQuerystringParam({ location }, 't', tab, 'all'))
  }, [location])

  const changeSort = useCallback(sort => {
    dispatch(updateUserSettings({ settings: { streamSortBy: sort } }))
    dispatch(changeQuerystringParam({ location }, 's', sort, 'all'))
  }, [location])

  const changeView = useCallback(view => {
    dispatch(updateUserSettings({ settings: { streamViewMode: view } }))
    dispatch(changeQuerystringParam({ location }, 'v', view, 'all'))
  }, [location])

  const changeChildPostInclusion = useCallback(childPostsBool => {
    dispatch(updateUserSettings({ settings: { streamChildPosts: childPostsBool } }))
    dispatch(changeQuerystringParam({ location }, 'c', childPostsBool, 'yes'))
  }, [location])

  const changeSearch = useCallback(search => {
    dispatch(changeQuerystringParam({ location }, 'search', search, 'all'))
  }, [location])

  const changeDecisionView = useCallback(view => {
    dispatch(changeQuerystringParam({ location }, 'd', view, 'proposals'))
  }, [location])

  const newPost = () => dispatch(push(createPostUrl(params, querystringParams)))

  if (topicLoading) return <Loading />

  return (
    <>
      <Helmet>
        <title>{group ? `${group.name} | ` : ''}Hylo</title>
        <meta name='description' content={group ? `Posts from ${group.name}. ${group.description}` : 'Group Not Found'} />
      </Helmet>
      {topicName
        ? (
          <TopicFeedHeader
            isSubscribed={groupTopic && groupTopic.isSubscribed}
            toggleSubscribe={
              groupTopic
                ? () => dispatch(toggleGroupTopicSubscribe(groupTopic))
                : null
            }
            groupSlug={groupSlug}
            topicName={topicName}
            postsTotal={groupTopic?.postsTotal || topic?.postsTotal}
            followersTotal={groupTopic?.followersTotal || topic?.followersTotal}
            type={postTypeFilter}
            currentUser={currentUser}
            bannerUrl={group && group.bannerUrl}
            newPost={newPost}
          />
        ) : (
          <GroupBanner
            customPostTypes={customView?.type === 'stream' ? customView?.postTypes : null}
            customActivePostsOnly={customView?.type === 'stream' ? customView?.activePostsOnly : false}
            customViewTopics={customView?.type === 'stream' ? customView?.topics?.toModelArray() : null}
            customViewType={customView?.type}
            context={context}
            currentUser={currentUser}
            currentUserHasMemberships={currentUserHasMemberships}
            group={group}
            isAboutOpen={isAboutOpen}
            newPost={newPost}
            querystringParams={querystringParams}
            routeParams={params}
            type={postTypeFilter}
            icon={customView?.icon}
            label={customView?.name}
          />
        )}
      <ViewControls
        routeParams={params} view={view} customPostTypes={customView?.type === 'stream' ? customView?.postTypes : null} customViewType={customView?.type}
        postTypeFilter={postTypeFilter} sortBy={sortBy} viewMode={viewMode} searchValue={search}
        changeTab={changeTab} context={context} changeSort={changeSort} changeView={changeView} changeSearch={changeSearch}
        changeChildPostInclusion={changeChildPostInclusion} childPostInclusion={childPostInclusion}
        decisionView={decisionView} changeDecisionView={changeDecisionView}
      />
      {decisionView !== 'moderation' && <div className={cx(styles.streamItems, { [styles.streamGrid]: viewMode === 'grid', [styles.bigGrid]: viewMode === 'bigGrid' })}>
        {!pending && posts.length === 0 ? <NoPosts /> : ''}
        {posts.map(post => {
          const expanded = selectedPostId === post.id
          const groupSlugs = post.groups.map(group => group.slug)
          return (
            <ViewComponent
              className={cx({ [styles.cardItem]: viewMode === 'cards', [styles.expanded]: expanded })}
              expanded={expanded}
              routeParams={params}
              post={post}
              key={post.id}
              currentUser={currentUser}
              respondToEvent={(post) => (response) => dispatch(respondToEvent(post, response))}
              querystringParams={querystringParams}
              childPost={![CONTEXT_MY, 'all', 'public'].includes(context) && !groupSlugs.includes(groupSlug)}
            />
          )})}
      </div>}
      {decisionView === 'moderation' && (<div className='streamItems'>
        {!pendingModerationActions && moderationActions.length === 0 ? <NoPosts /> : ''}
        {moderationActions.map(modAction => {
            return (
              <ModerationListItem
                group={group}
                key={modAction.id}
                moderationAction={modAction}
                handleClearModerationAction={() => dispatch(clearModerationAction({ postId: modAction?.post?.id, moderationActionId: modAction?.id, groupId: group?.id }))}
              />
            )
          })}
        </div>)}
      <ScrollListener
        onBottom={() => fetchPosts(posts.length)}
        elementId={CENTER_COLUMN_ID}
      />
      {pending && <Loading />}
    </>
  )
}
