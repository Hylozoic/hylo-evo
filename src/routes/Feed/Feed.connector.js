import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getCommunityTopicForCurrentRoute from 'store/selectors/getCommunityTopicForCurrentRoute'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import changeQueryParam from 'store/actions/changeQueryParam'
import getQueryParam from 'store/selectors/getQueryParam'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import { makeUrl } from 'util/navigation'

import { fetchTopic, fetchCommunityTopic } from './Feed.store'

export function mapStateToProps (state, props) {
  let community, communityTopic, topic
  const communitySlug = getParam('slug', state, props)
  const topicName = getParam('topicName', state, props)
  if (communitySlug) {
    community = getCommunityForCurrentRoute(state, props)
    communityTopic = getCommunityTopicForCurrentRoute(state, props)
    communityTopic = communityTopic && communityTopic.ref
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
    topic = topic && topic.ref
  }
  const filter = getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)

  return {
    filter,
    sortBy,
    communityTopic,
    communitySlug,
    topicName,
    topic,
    postsTotal: get('postsTotal', communitySlug ? communityTopic : topic),
    followersTotal: get('followersTotal', communitySlug ? communityTopic : topic),
    selectedPostId: getParam('postId', state, props),
    community,
    postCount: get('postCount', community),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const slug = getParam('slug', null, props)
  const topicName = getParam('topicName', null, props)
  const params = getQueryParam(['s', 't'], null, props)

  return {
    changeTab: tab => dispatch(changeQueryParam(props, 't', tab, 'all')),
    changeSort: sort => dispatch(changeQueryParam(props, 's', sort, 'all')),
    // we need to preserve url parameters when opening the details for a post,
    // or the center column will revert to its default sort & filter settings
    showPostDetails: id => dispatch(push(makeUrl(postUrl(id, slug, {topicName}), params))),
    newPost: () => dispatch(push(`${slug}/p/new`)),
    editPost: (postId) => dispatch(push(`${slug}/p/${postId}/edit`)),
    fetchTopic: () => {
      if (slug && topicName) {
        return dispatch(fetchCommunityTopic(topicName, slug))
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
