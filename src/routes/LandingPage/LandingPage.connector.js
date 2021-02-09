import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { groupUrl } from 'util/navigation'
import fetchCommunity from 'store/actions/fetchCommunityBySlug'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getRouteParam from 'store/selectors/getRouteParam'
import presentGroup from 'store/presenters/presentGroup'
import presentPost from 'store/presenters/presentPost'

export function mapStateToProps (state, props) {
  let group
  const groupSlug = getRouteParam('slug', state, props)
  
  if (groupSlug) {
    group = presentGroup(getGroupForCurrentRoute(state, props))
    // communityTopic = getCommunityTopicForCurrentRoute(state, props)
    // communityTopic = communityTopic && { ...communityTopic.ref, community: communityTopic.community, topic: communityTopic.topic }
  }

  return {
    group,
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupSlug = getRouteParam('slug', {}, props)
  const url = `${groupUrl(groupSlug)}/about`

  return {
    fetchCommunity: () => dispatch(fetchCommunity(groupSlug)),
    showAbout: async () => {
      await fetchCommunity(groupSlug)
      dispatch(push(url))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
