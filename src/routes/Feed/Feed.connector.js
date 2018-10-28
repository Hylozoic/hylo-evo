import { connect } from 'react-redux'
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
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { push, replace } from 'react-router-redux'
import { postUrl, topicsUrl, makeUrl } from 'util/navigation'
import { fetchTopic, fetchCommunityTopic, fetchNetwork } from './Feed.store'
import { FETCH_FOR_CURRENT_USER } from '../PrimaryLayout/PrimaryLayout.store'

export function mapStateToProps (state, props) {
  let community, communityTopic, topic, network

  const currentUser = getMe(state)
  const currentUserHasMemberships = !isEmpty(getMemberships(state))
  const communitySlug = getParam('slug', state, props)
  const topicName = getParam('topicName', state, props)
  const networkSlug = getParam('networkSlug', state, props)
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

export const mapDispatchToProps = function (dispatch, props) {
  const slug = getParam('slug', null, props)
  const topicName = getParam('topicName', null, props)
  const params = getQueryParam(['s', 't'], null, props)
  const postTypeContext = getPostTypeContext(null, props)
  const networkSlug = getParam('networkSlug', null, props)

  return {
    changeTab: tab => dispatch(changeQueryParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'all')),
    // we need to preserve url parameters when opening the details for a post,
    // or the center column will revert to its default sort & filter settings
    showPostDetails: (id, postTypeContext = null) =>
      dispatch(push(makeUrl(postUrl(id, slug, {postTypeContext, topicName, networkSlug}), params))),
    newPost: () =>
      dispatch(push(makeUrl(postUrl('new', slug, {postTypeContext, topicName, networkSlug}), params))),
    fetchTopic: () => {
      if (slug && topicName) {
        return dispatch(fetchCommunityTopic(topicName, slug))
        .then(action => {
          // redirect if no topic found
          if (!action.payload.data.communityTopic) {
            dispatch(replace(topicsUrl(slug)))
          }
        })
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    },
    fetchNetwork: () => dispatch(fetchNetwork(networkSlug)),
    goToCreateCommunity: () => dispatch(push('/create-community/name'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
