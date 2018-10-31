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
import getQueryParam from 'store/selectors/getQueryParam'
import changeQueryParam from 'store/actions/changeQueryParam'
import voteOnPost from 'store/actions/voteOnPost'
import { postUrl, newPostUrl, topicsUrl, makeUrl } from 'util/navigation'
import { fetchTopic, fetchCommunityTopic, fetchNetwork } from './Feed.store'
import { FETCH_FOR_CURRENT_USER } from '../PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  let community, communityTopic, topic, network

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

  // TODO: TBD - consolidate this getQueryParam('t', ...) into getPostTypeContext
  const postTypeFilter = postTypeContext || getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)

  return {
    postTypeContext,
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
  const matchParams = get('match.params', props)
  const queryStringParams = getQueryParam(['s', 't'], null, props)
  const networkSlug = getParam('networkSlug', null, props)

  return {
    changeTab: tab => dispatch(changeQueryParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'all')),
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
    voteOnPost: (postId, myVote) => dispatch(voteOnPost(postId, myVote)),
    newPost: () => dispatch(push(makeUrl(newPostUrl(matchParams), queryStringParams))),
    showPostDetails: postId => dispatch(push(makeUrl(postUrl(postId, matchParams), queryStringParams)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
