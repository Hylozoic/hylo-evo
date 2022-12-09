import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import {
  fetchGroupTopic,
  fetchPosts,
  fetchTopic,
  getCustomView,
  getHasMorePosts,
  getPosts
} from 'routes/Stream/Stream.store'
import getRouteParam from 'store/selectors/getRouteParam'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import presentPost from 'store/presenters/presentPost'
import respondToEvent from 'store/actions/respondToEvent'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'

import { createPostUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  let group, topic, groupTopic
  let groupId = 0

  const groupSlug = getRouteParam('groupSlug', state, props)

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
  const topicName = getRouteParam('topicName', state, props)
  const topicLoading = isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state)

  if (groupSlug) {
    groupTopic = getGroupTopicForCurrentRoute(state, props)
    groupTopic = groupTopic && { ...groupTopic.ref, group: groupTopic.group, topic: groupTopic.topic }
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }

  const context = getRouteParam('context', state, props)
  const view = getRouteParam('view', state, props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const projectsDefault = view === 'projects' ? 'bigGrid' : null
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards'
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined
  const defaultChildPostInclusion = get('settings.streamChildPosts', currentUser) || 'yes'

  const querystringParams = getQuerystringParam(['s', 't', 'v', 'c', 'search'], null, props)
  const postTypeFilter = view === 'projects' ? 'project' : getQuerystringParam('t', state, props) || defaultPostType
  const search = getQuerystringParam('search', state, props)
  let sortBy = getQuerystringParam('s', state, props) || customViewSort || defaultSortBy
  // Only custom views can be sorted by manual order
  if (!customView && sortBy === 'order') {
    sortBy = 'updated'
  }
  const viewMode = getQuerystringParam('v', state, props) || customViewMode || projectsDefault || defaultViewMode
  const childPostInclusion = getQuerystringParam('c', state, props) || defaultChildPostInclusion

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
  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, groupId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

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
    fetchPostsParam,
    group,
    hasMore,
    pending: state.pending[FETCH_POSTS],
    postTypeFilter,
    posts,
    querystringParams,
    postsTotal: get('postsTotal', groupSlug ? groupTopic : topic),
    followersTotal: get('followersTotal', groupSlug ? groupTopic : topic),
    routeParams,
    search,
    selectedPostId: getRouteParam('postId', state, props),
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
  const groupSlug = getRouteParam('groupSlug', null, props)
  const topicName = getRouteParam('topicName', null, props)
  const updateSettings = (params) => dispatch(updateUserSettings(params))
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  return {
    respondToEvent: (postId) => response => dispatch(respondToEvent(postId, response)),
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
    fetchPosts: param => offset => {
      return dispatch(fetchPosts({ offset, ...param }))
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
  const { fetchPostsParam } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
