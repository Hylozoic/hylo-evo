import { get, isEmpty } from 'lodash/fp'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import fetchPosts from 'store/actions/fetchPosts'
import {
  FETCH_POSTS, FETCH_FOR_CURRENT_USER
} from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { getHasMorePosts, getPosts } from 'store/selectors/getPosts'
import { createPostUrl } from 'util/navigation'

import { updateTimeframe } from './Events.store'

export function mapStateToProps (state, props) {
  let group

  const routeParams = get('match.params', props)
  const location = get('location', props)
  const currentUser = getMe(state)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const groupSlug = getRouteParam('groupSlug', state, props)

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
  }

  const timeframe = state.Events.timeframe

  const fetchPostsParam = {
    afterTime: timeframe === 'future' ? new Date().toISOString() : null,
    beforeTime: timeframe === 'past' ? new Date().toISOString() : null,
    context: routeParams.context,
    filter: 'event',
    order: timeframe === 'future' ? 'asc' : 'desc',
    slug: groupSlug,
    sortBy: 'start_time'
  }

  // NOTE: In effort to better seperate the query caching from component details
  //       it's better (and necessary) in this case to send the fetch param then
  //       the raw props of the component.
  const posts = getPosts(state, fetchPostsParam).map(p => presentPost(p, get('id', group)))
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    routeParams,
    location,
    currentUser,
    currentUserHasMemberships,
    fetchPostsParam,
    groupSlug,
    group,
    hasMore,
    membershipsPending: state.pending[FETCH_FOR_CURRENT_USER],
    posts,
    pending: state.pending[FETCH_POSTS],
    timeframe
  }
}

export function mapDispatchToProps (dispatch, props) {
  const routeParams = get('match.params', props)

  return {
    fetchEvents: (params) => (offset) => dispatch(fetchPosts({ offset, ...params })),
    updateTimeframe: timeframe => dispatch(updateTimeframe(timeframe)),
    newPost: () => dispatch(push(createPostUrl(routeParams, { newPostType: 'event' })))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchPostsParam } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchEvents: dispatchProps.fetchEvents(fetchPostsParam)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
