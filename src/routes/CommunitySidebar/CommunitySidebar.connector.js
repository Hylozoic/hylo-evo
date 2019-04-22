import { connect } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getCanModerate from 'store/selectors/getCanModerate'
import getHolochainActive from 'store/selectors/getHolochainActive'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray().slice(0, 8) : []
  const leaders = community ? community.moderators.toModelArray() : []
  const canModerate = getCanModerate(state, { community })
  const holochainActive = getHolochainActive(state)
  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getRouteParam('slug', state, props),
    canModerate,
    holochainActive
  }
}

export default connect(mapStateToProps)
