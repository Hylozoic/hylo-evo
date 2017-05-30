import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { omit } from 'lodash'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import fetchCommunityTopics from 'store/actions/fetchCommunityTopics'
import { setSort } from './AllTopics.store'

// TODO: this selector will also have to depend upon sorting parameters for the
// sorting dropdown to work.
const getCommunityTopics = ormCreateSelector(
  orm,
  state => state.orm,
  getCommunityForCurrentRoute,
  (session, community) => {
    return community
      ? session.CommunityTopic
      .filter({community: community.id})
      .orderBy(ct => -ct.postsTotal)
      .toModelArray()
      : []
  }
)

export function mapStateToProps (state, props) {
  const selectedSort = state.AllTopics.sort
  return {
    community: getCommunityForCurrentRoute(state, props),
    communityTopics: getCommunityTopics(state, props),
    slug: getParam('slug', state, props),
    totalTopics: 25,
    selectedSort
  }
}

const mapDispatchToProps = {fetchCommunityTopics, toggleTopicSubscribe, setSort}

function mergeProps (stateProps, dispatchProps, ownProps) {
  const { community } = stateProps
  const { setSort, fetchCommunityTopics, toggleTopicSubscribe } = dispatchProps

  return {
    ...omit(stateProps, 'community'),
    ...ownProps,
    setSort,
    fetchCommunityTopics: offset =>
      fetchCommunityTopics(community.id, false, offset),
    toggleSubscribe: (topicId, isSubscribing) =>
      toggleTopicSubscribe(topicId, community.id, isSubscribing)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
