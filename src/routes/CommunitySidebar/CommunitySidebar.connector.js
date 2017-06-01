import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray().slice(0, 8) : []
  const leaders = community ? community.moderators.toModelArray() : []
  const currentUser = getMe(state, props)
  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getParam('slug', state, props),
    currentUser
  }
}

export default connect(mapStateToProps)
