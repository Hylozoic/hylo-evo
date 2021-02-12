import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import getRouteParam from 'store/selectors/getRouteParam'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import {
  fetchPosts,
  getPosts,
  getHasMorePosts
} from 'components/FeedList/FeedList.store'
import presentPost from 'store/presenters/presentPost'

export function mapStateToProps (state, props) {
  let group
  let groupId = 0

  const routeParams = get('match.params', props)
  const groupSlug = getRouteParam('groupSlug', state, props)
  const context = getRouteParam('context', state, props)

  const querystringParams = getQuerystringParam(['s', 't', 'v'], null, props)
  const postTypeFilter = getQuerystringParam('t', state, props)
  const sortBy = getQuerystringParam('s', state, props) || 'created'
  const viewMode = getQuerystringParam('v', state, props) || 'list'

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
    routeParams,
    querystringParams,
    fetchPostsParam,
    group,
    context,
    selectedPostId: getRouteParam('postId', state, props),
    postTypeFilter,
    sortBy,
    viewMode,
    posts,
    hasMore,
    pending: state.pending[FETCH_POSTS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    changeTab: tab => dispatch(changeQuerystringParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'all')),
    changeView: view => dispatch(changeQuerystringParam(props, 'v', view, 'all')),
    fetchPosts: param => offset => {
      return dispatch(fetchPosts({ offset, ...param }))
    }
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
