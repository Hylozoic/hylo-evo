import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { isEmpty } from 'lodash'
import { FETCH_POSTS, FETCH_FOR_CURRENT_USER } from 'store/constants'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getCommunityTopicForCurrentRoute from 'store/selectors/getCommunityTopicForCurrentRoute'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import { newPostUrl } from 'util/navigation'
import { fetchTopic, fetchCommunityTopic, fetchNetwork } from './Feed.store'

export function mapStateToProps (state, props) {
  let community, communityTopic, topic, network

  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const currentUser = getMe(state)
  const currentUserHasMemberships = !isEmpty(getMemberships(state))
  const communitySlug = getRouteParam('slug', state, props)
  const networkSlug = getRouteParam('networkSlug', state, props)
  const topicName = getRouteParam('topicName', state, props)
  const postTypeContext = getPostTypeContext(state, props)

  if (communitySlug) {
    community = getCommunityForCurrentRoute(state, props)
    communityTopic = getCommunityTopicForCurrentRoute(state, props)
    communityTopic = communityTopic && { ...communityTopic.ref, community: communityTopic.community, topic: communityTopic.topic }
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }
  if (networkSlug) {
    network = getNetworkForCurrentRoute(state, props)
  }

  // * TBD - consolidate this getQuerystringParam('t', ...) into getPostTypeContext
  const postTypeFilter = postTypeContext || getQuerystringParam('t', state, props)
  const sortBy = getQuerystringParam('s', state, props)

  return {
    routeParams,
    querystringParams,
    postTypeFilter,
    sortBy,
    currentUser,
    currentUserHasMemberships,
    communityTopic,
    communitySlug,
    community,
    topicName,
    topic,
    postsTotal: get('postsTotal', communitySlug ? communityTopic : topic),
    followersTotal: get('followersTotal', communitySlug ? communityTopic : topic),
    selectedPostId: getRouteParam('postId', state, props),
    membershipsPending: state.pending[FETCH_FOR_CURRENT_USER],
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    networkSlug,
    network
  }
}

export function mapDispatchToProps (dispatch, props) {
  const communitySlug = getRouteParam('slug', null, props)
  const topicName = getRouteParam('topicName', null, props)
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const networkSlug = getRouteParam('networkSlug', null, props)

  return {
    changeTab: tab => dispatch(changeQuerystringParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'all')),
    fetchTopic: () => {
      if (communitySlug && topicName) {
        return dispatch(fetchCommunityTopic(topicName, communitySlug))
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    },
    fetchNetwork: () => dispatch(fetchNetwork(networkSlug)),
    goToCreateCommunity: () => dispatch(push('/create-community/name')),
    newPost: () => dispatch(push(newPostUrl(routeParams, querystringParams)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
