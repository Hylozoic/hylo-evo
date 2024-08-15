import { push } from 'connected-react-router'
import { get, isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import fetchGroupTopic from 'store/actions/fetchGroupTopic'
import fetchTopic from 'store/actions/fetchTopic'
import fetchPosts from 'store/actions/fetchPosts'
import respondToEvent from 'store/actions/respondToEvent'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import { FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC, CONTEXT_MY, VIEW_MENTIONS, VIEW_ANNOUNCEMENTS, VIEW_INTERACTIONS, VIEW_POSTS, FETCH_MODERATION_ACTIONS } from 'store/constants'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getRouteParam from 'store/selectors/getRouteParam'
import { getHasMorePosts, getPosts } from 'store/selectors/getPosts'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import { createPostUrl } from 'util/navigation'
import { fetchModerationActions, clearModerationAction } from 'store/actions/moderationActions'
import { getHasMoreModerationActions, getModerationActions } from 'store/selectors/getModerationActions'

export const getCustomView = ormCreateSelector(
  orm,
  (_, props) => getRouteParam('customViewId', props),
  (session, id) => session.CustomView.safeGet({ id })
)

export function mapStateToProps (state, props) {
  let group, topic, groupTopic
  let groupId = 0

  const groupSlug = getRouteParam('groupSlug', props)

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupId = group.id
  }

  const routeParams = get('match.params', props)
  const customView = getCustomView(state, props)
  const customViewType = customView?.type
  const customPostTypes = customViewType === 'stream' ? customView?.postTypes : null
  const customViewMode = customView?.defaultViewMode
  const customViewName = customView?.name
  const customViewIcon = customView?.icon
  const activePostsOnly = customViewType === 'stream' ? customView?.activePostsOnly : false
  const customViewTopics = customViewType === 'stream' ? customView?.topics : null
  const customViewSort = customView?.defaultSort
  const viewName = customViewName
  const viewIcon = customViewIcon
  const topicName = getRouteParam('topicName', props)
  const topicLoading = isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state)
  const isAboutOpen = getRouteParam('detailGroupSlug', props)

  if (groupSlug) {
    groupTopic = getGroupTopicForCurrentRoute(state, props)
    groupTopic = groupTopic && { ...groupTopic.ref, group: groupTopic.group, topic: groupTopic.topic }
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }

  const context = getRouteParam('context', props)
  const view = getRouteParam('view', props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const projectsDefault = view === 'projects' ? 'bigGrid' : null
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards'
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined
  const defaultChildPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'

  const querystringParams = getQuerystringParam(['s', 't', 'v', 'c', 'search', 'd'], props)
  const determinePostTypeFilter = () => {
    if (view === 'projects') return 'project'
    if (view === 'proposals') return 'proposal'
    return getQuerystringParam('t', props) || defaultPostType
  }
  const postTypeFilter = determinePostTypeFilter()
  const search = getQuerystringParam('search', props)
  let sortBy = getQuerystringParam('s', props) || customViewSort || defaultSortBy
  // Only custom views can be sorted by manual order
  if (!customView && sortBy === 'order') {
    sortBy = 'updated'
  }
  const viewMode = getQuerystringParam('v', props) || customViewMode || projectsDefault || defaultViewMode
  const childPostInclusion = getQuerystringParam('c', props) || defaultChildPostInclusion

  const fetchPostsParam = {
    activePostsOnly,
    childPostInclusion,
    context,
    topicName,
    filter: postTypeFilter,
    forCollection: customView?.type === 'collection' ? customView?.collectionId : null,
    slug: groupSlug,
    search,
    sortBy,
    topic: topic?.id,
    topics: customViewTopics?.toModelArray().map(t => t.id) || [],
    types: customPostTypes
  }

  if (context === CONTEXT_MY && view === VIEW_MENTIONS) fetchPostsParam.mentionsOf = [currentUser.id]
  if (context === CONTEXT_MY && view === VIEW_ANNOUNCEMENTS) fetchPostsParam.announcementsOnly = true
  if (context === CONTEXT_MY && view === VIEW_INTERACTIONS) fetchPostsParam.interactedWithBy = [currentUser.id]
  if (context === CONTEXT_MY && view === VIEW_POSTS) fetchPostsParam.createdBy = [currentUser.id]

  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, groupId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  const decisionView = getQuerystringParam('d', state, props) || 'proposal'
  let fetchModerationActionParam, moderationActions, hasMoreModerationActions
  if (decisionView === 'moderation') {
    fetchModerationActionParam = {
      slug: groupSlug,
      groupId,
      sortBy
    }

    moderationActions = getModerationActions(state, fetchModerationActionParam)
    hasMoreModerationActions = getHasMoreModerationActions(state, fetchModerationActionParam)
  }

  return {
    childPostInclusion,
    customActivePostsOnly: activePostsOnly,
    customViewId: customView?.id,
    customViewType,
    context,
    currentUser,
    currentUserHasMemberships,
    customViewTopics: customViewTopics?.toModelArray(),
    customPostTypes,
    decisionView,
    fetchPostsParam,
    fetchModerationActionParam,
    group,
    hasMore,
    hasMoreModerationActions,
    isAboutOpen,
    moderationActions,
    pending: state.pending[FETCH_POSTS],
    pendingModerationActions: state.pending[FETCH_MODERATION_ACTIONS],
    postTypeFilter,
    posts,
    querystringParams,
    postsTotal: get('postsTotal', groupSlug ? groupTopic : topic),
    followersTotal: get('followersTotal', groupSlug ? groupTopic : topic),
    routeParams,
    search,
    selectedPostId: getRouteParam('postId', props),
    sortBy,
    topicLoading,
    topicName,
    topic,
    view,
    viewIcon,
    viewName,
    viewMode
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupSlug = getRouteParam('groupSlug', props)
  const topicName = getRouteParam('topicName', props)
  const updateSettings = (params) => dispatch(updateUserSettings(params))
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], props)

  return {
    respondToEvent: (post) => response => dispatch(respondToEvent(post, response)),
    updateUserSettings: updateSettings,
    changeTab: tab => {
      updateSettings({ settings: { streamPostType: tab || '' } })
      return dispatch(changeQuerystringParam(props, 't', tab, 'all'))
    },
    changeSort: sort => {
      updateSettings({ settings: { streamSortBy: sort } })
      return dispatch(changeQuerystringParam(props, 's', sort, 'all'))
    },
    changeView: view => {
      updateSettings({ settings: { streamViewMode: view } })
      return dispatch(changeQuerystringParam(props, 'v', view, 'all'))
    },
    changeChildPostInclusion: childPostsBool => {
      updateSettings({ settings: { streamChildPosts: childPostsBool } })
      return dispatch(changeQuerystringParam(props, 'c', childPostsBool, 'yes'))
    },
    changeSearch: search => {
      return dispatch(changeQuerystringParam(props, 'search', search, 'all'))
    },
    changeDecisionView: view => {
      return dispatch(changeQuerystringParam(props, 'd', view, 'proposals'))
    },
    clearModerationAction: ({ moderationActionId, postId, groupId }) => dispatch(clearModerationAction({ moderationActionId, postId, groupId })),
    fetchPosts: param => offset => {
      return dispatch(fetchPosts({ offset, ...param }))
    },
    fetchModerationActions: param => offset => {
      return dispatch(fetchModerationActions({ offset, ...param }))
    },
    fetchTopic: () => {
      if (groupSlug && topicName) {
        return dispatch(fetchGroupTopic(topicName, groupSlug))
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    },
    toggleGroupTopicSubscribe: groupTopic =>
      dispatch(toggleGroupTopicSubscribe(groupTopic)),
    newPost: () => dispatch(push(createPostUrl(routeParams, querystringParams)))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam, fetchModerationActionParam } = stateProps
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam),
    fetchModerationActions: dispatchProps.fetchModerationActions(fetchModerationActionParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
