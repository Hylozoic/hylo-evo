import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { getCanModerate } from './CommunitySidebar.store'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray().slice(0, 8) : []
  const leaders = community ? community.moderators.toModelArray() : []
  const canModerate = getCanModerate(state, {community})
  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getParam('slug', state, props),
    canModerate
  }
}

export default connect(mapStateToProps)
