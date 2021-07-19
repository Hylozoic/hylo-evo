import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { isEmpty } from 'lodash'
import {
  FETCH_POSTS, FETCH_FOR_CURRENT_USER,
  FETCH_TOPIC, FETCH_GROUP_TOPIC
} from 'store/constants'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import { createGroupUrl, createPostUrl } from 'util/navigation'
import { fetchTopic, fetchGroupTopic } from './Feed.store'
import isPendingFor from 'store/selectors/isPendingFor'

export function mapStateToProps (state, props) {
  let group, groupTopic, topic

  const routeParams = get('match.params', props)
  const location = get('location', props)
  const view = routeParams.view
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const currentUser = getMe(state)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))
  const groupSlug = getRouteParam('groupSlug', state, props)
  const topicName = getRouteParam('topicName', state, props)
  const topicLoading = isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state)

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupTopic = getGroupTopicForCurrentRoute(state, props)
    groupTopic = groupTopic && { ...groupTopic.ref, group: groupTopic.group, topic: groupTopic.topic }
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }

  const postTypeFilter = view === 'projects' ? 'project' : (view === 'events' ? 'event' : getQuerystringParam('t', state, props))
  const sortBy = getQuerystringParam('s', state, props)

  return {
    routeParams,
    querystringParams,
    location,
    postTypeFilter,
    sortBy,
    currentUser,
    currentUserHasMemberships,
    groupTopic,
    groupSlug,
    group,
    topicLoading,
    topicName,
    topic,
    postsTotal: get('postsTotal', groupSlug ? groupTopic : topic),
    followersTotal: get('followersTotal', groupSlug ? groupTopic : topic),
    selectedPostId: getRouteParam('postId', state, props),
    membershipsPending: state.pending[FETCH_FOR_CURRENT_USER],
    postCount: get('postCount', group),
    pending: state.pending[FETCH_POSTS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupSlug = getRouteParam('groupSlug', null, props)
  const topicName = getRouteParam('topicName', null, props)
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  return {
    changeTab: tab => dispatch(changeQuerystringParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'all')),
    fetchTopic: () => {
      if (groupSlug && topicName) {
        return dispatch(fetchGroupTopic(topicName, groupSlug))
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    },
    toggleGroupTopicSubscribe: groupTopic =>
      dispatch(toggleGroupTopicSubscribe(groupTopic)),
    goToCreateGroup: () => dispatch(push(createGroupUrl(routeParams))),
    newPost: () => dispatch(push(createPostUrl(routeParams, querystringParams)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
