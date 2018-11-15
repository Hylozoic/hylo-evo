import { connect } from 'react-redux'
import { push, replace } from 'react-router-redux'
import { get } from 'lodash/fp'
import { isEmpty } from 'lodash'
import { FETCH_POSTS } from 'store/constants'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import getCommunityTopicForCurrentRoute from 'store/selectors/getCommunityTopicForCurrentRoute'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getParam from 'store/selectors/getParam'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import getMe from 'store/selectors/getMe'
import getMemberships from 'store/selectors/getMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import { newPostUrl, topicsUrl } from 'util/navigation'
import { fetchTopic, fetchCommunityTopic, fetchNetwork } from './Feed.store'
import { FETCH_FOR_CURRENT_USER } from '../PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  let community, communityTopic, topic, network

  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const currentUser = getMe(state)
  const currentUserHasMemberships = !isEmpty(getMemberships(state))
  const communitySlug = getParam('slug', state, props)
  const networkSlug = getParam('networkSlug', state, props)
  const topicName = getParam('topicName', state, props)
  const postTypeContext = getPostTypeContext(state, props)

  if (communitySlug) {
    community = getCommunityForCurrentRoute(state, props)
    communityTopic = getCommunityTopicForCurrentRoute(state, props)
    communityTopic = communityTopic && communityTopic.ref
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
    topic = topic && topic.ref
  }
  if (networkSlug) {
    network = getNetworkForCurrentRoute(state, props)
  }

  // TODO: TBD - consolidate this getQuerystringParam('t', ...) into getPostTypeContext
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
    selectedPostId: getParam('postId', state, props),
    membershipsPending: state.pending[FETCH_FOR_CURRENT_USER],
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    networkSlug,
    network
  }
}

export function mapDispatchToProps (dispatch, props) {
  const communitySlug = getParam('slug', null, props)
  const topicName = getParam('topicName', null, props)
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const networkSlug = getParam('networkSlug', null, props)

  return {
    changeTab: tab => dispatch(changeQuerystringParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQuerystringParam(props, 's', sort, 'all')),
    fetchTopic: () => {
      if (communitySlug && topicName) {
        return dispatch(fetchCommunityTopic(topicName, communitySlug))
        .then(action => {
          // redirect if no topic found
          if (!action.payload.data.communityTopic) {
            dispatch(replace(topicsUrl(communitySlug)))
          }
        })
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
