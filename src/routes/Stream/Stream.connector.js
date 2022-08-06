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
import respondToEvent from 'store/actions/respondToEvent'

import { createPostUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  let group
  let groupId = 0

  const routeParams = get('match.params', props)
  const groupSlug = getRouteParam('groupSlug', state, props)
  const context = getRouteParam('context', state, props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const defaultSortBy = get('settings.streamSortBy', currentUser) || 'updated'
  const defaultViewMode = get('settings.streamViewMode', currentUser) || 'cards' // TODO: add soemthing here to change default for projects
  const defaultPostType = get('settings.streamPostType', currentUser) || undefined

  const querystringParams = getQuerystringParam(['s', 't', 'v'], null, props)
  const postTypeFilter = getQuerystringParam('t', state, props) || defaultPostType
  const sortBy = getQuerystringParam('s', state, props) || defaultSortBy
  const viewMode = getQuerystringParam('v', state, props) || defaultViewMode // TODO: or do we just create a default for projects/prize by adding something to the url in links?

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupId = group.id
  }

  const fetchPostsParam = {
    filter: postTypeFilter,
    slug: groupSlug,
    context,
    sortBy
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
