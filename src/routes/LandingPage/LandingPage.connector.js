import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { communityUrl } from 'util/navigation'
import fetchCommunity from 'store/actions/fetchCommunityBySlug'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import presentCommunity from 'store/presenters/presentCommunity'

export function mapStateToProps (state, props) {
  let community, communityTopic
  const communitySlug = getRouteParam('slug', state, props)

  if (communitySlug) {
    community = presentCommunity(getCommunityForCurrentRoute(state, props))
    // communityTopic = getCommunityTopicForCurrentRoute(state, props)
    // communityTopic = communityTopic && { ...communityTopic.ref, community: communityTopic.community, topic: communityTopic.topic }
  }
  return {
    community,
    communityTopic
  }
}

export function mapDispatchToProps (dispatch, props) {
  const communitySlug = getRouteParam('slug', {}, props)
  const url = `${communityUrl(communitySlug)}/about`

  return {
    fetchCommunity: () => dispatch(fetchCommunity(communitySlug)),
    showAbout: async () => {
      await fetchCommunity(communitySlug)
      dispatch(push(url))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
