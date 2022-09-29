import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getRouteParam from 'store/selectors/getRouteParam'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import {
  fetchPosts,
  getCustomView,
  getPosts,
  getHasMorePosts
} from 'components/FeedList/FeedList.store'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import presentPost from 'store/presenters/presentPost'
import respondToEvent from 'store/actions/respondToEvent'

import { createPostUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  let group
  let groupId = 0

  const groupSlug = getRouteParam('groupSlug', state, props)

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupId = group.id
  }

  const routeParams = get('match.params', props)
  const customView = getCustomView(state, props)
  const customPostTypes = customView?.postTypes
  const customViewMode = customView?.viewMode
  const customViewName = customView?.name
  const customViewIcon = customView?.icon
  const activePostsOnly = customView?.activePostsOnly
  const customViewTopics = customView?.topics
  const viewName = customViewName
  const viewIcon = customViewIcon

  const context = getRouteParam('context', state, props)
  const view = getRouteParam('view', state, props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const projectsDefault = view === 'projects' ? 'bigGrid' : null
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards'
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined

  const querystringParams = getQuerystringParam(['s', 't', 'v', 'search'], null, props)
  const postTypeFilter = getQuerystringParam('t', state, props) || defaultPostType
  const search = getQuerystringParam('search', state, props)
  const sortBy = getQuerystringParam('s', state, props) || defaultSortBy
  const viewMode = customViewMode || getQuerystringParam('v', state, props) || projectsDefault || defaultViewMode

  const fetchPostsParam = {
    activePostsOnly,
    context,
    filter: postTypeFilter,
    slug: groupSlug,
    search,
    sortBy,
    topics: customViewTopics?.toModelArray().map(t => t.id) || [],
    types: customPostTypes
  }

  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, groupId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    customActivePostsOnly: activePostsOnly,
    customViewId: customView?.id,
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
    routeParams,
    search,
    selectedPostId: getRouteParam('postId', state, props),
    sortBy,
    view,
    viewIcon,
    viewName,
    viewMode
  }
}

export function mapDispatchToProps (dispatch, props) {
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
    changeSearch: search => {
      return dispatch(changeQuerystringParam(props, 'search', search, 'all'))
    },
    fetchPosts: param => offset => {
      return dispatch(fetchPosts({ offset, ...param }))
    },
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
