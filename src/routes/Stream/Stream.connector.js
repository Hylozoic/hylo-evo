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
  getPosts,
  getHasMorePosts
} from 'components/FeedList/FeedList.store'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import presentPost from 'store/presenters/presentPost'
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
  const isCustomView = routeParams && routeParams.view === 'custom'
  const customView = isCustomView && group && group.customViews && group.customViews.items && group.customViews.items[0]
  const customPostType = customView && customView.postTypes[0]
  const customViewMode = customView && customView.viewMode
  console.log("customviewmode", customViewMode)
  const activePostsOnly = (customView && customView.activePostsOnly)

  const context = getRouteParam('context', state, props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards' // TODO: add soemthing here to change default for projects
  console.log("defaultViewMode", defaultViewMode)
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined

  const querystringParams = getQuerystringParam(['s', 't', 'v'], null, props)
  const postTypeFilter = customPostType || getQuerystringParam('t', state, props) || defaultPostType
  const sortBy = getQuerystringParam('s', state, props) || defaultSortBy
  const viewMode = customViewMode || getQuerystringParam('v', state, props) || defaultViewMode
  console.log("stream.connmect", viewMode)

  const fetchPostsParam = {
    filter: postTypeFilter,
    slug: groupSlug,
    context,
    sortBy,
    activePostsOnly
  }

  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, groupId))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    context,
    currentUser,
    currentUserHasMemberships,
    fetchPostsParam,
    group,
    hasMore,
    pending: state.pending[FETCH_POSTS],
    postTypeFilter,
    posts,
    querystringParams,
    routeParams,
    selectedPostId: getRouteParam('postId', state, props),
    sortBy,
    viewMode
  }
}

export function mapDispatchToProps (dispatch, props) {
  const updateSettings = (params) => dispatch(updateUserSettings(params))
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  return {
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
