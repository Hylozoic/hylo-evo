import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'
import getQueryParam from 'store/selectors/getQueryParam'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import { FETCH_POSTS } from 'store/constants'
import { mapDispatchToPropsForFeed } from 'routes/CommunityFeed'
import { fetchTopics } from './AllCommunitiesFeed.store'

export function mapStateToProps (state, props) {
  const filter = getQueryParam('t', state, props)
  const sortBy = getQueryParam('s', state, props)
  const topic = getTopicForCurrentRoute(state, props)

  return {
    filter,
    sortBy,
    topic,
    topicName: getParam('topicName', state, props),
    selectedPostId: getParam('postId', state, props),
    pending: state.pending[FETCH_POSTS],
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = function (dispatch, props) {
  const name = getParam('topicName', null, props)
  return {
    ...mapDispatchToPropsForFeed(dispatch, props),
    fetchTopic: () => dispatch(fetchTopics({name, first: 1}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
