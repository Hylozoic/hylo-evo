import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import orm from 'store/models'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { omit } from 'lodash'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import { fetchCommunityTopics } from './AllTopics.store'

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
      .orderBy(ct => -ct.followersTotal)
      .toModelArray()
      : []
  }
)

export function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    communityTopics: getCommunityTopics(state, props),
    slug: getParam('slug', state, props),
    totalTopics: 25
  }
}

const mapDispatchToProps = {fetchCommunityTopics, toggleTopicSubscribe}

function mergeProps (sProps, dProps, ownProps) {
  const { community } = sProps
  return {
    ...omit(sProps, 'community'),
    ...ownProps,
    fetchCommunityTopics: () => dProps.fetchCommunityTopics(community.id),
    toggleSubscribe: (topicId, isSubscribing) =>
      dProps.toggleTopicSubscribe(topicId, community.id, isSubscribing)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
