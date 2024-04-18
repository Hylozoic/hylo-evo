import { connect } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getCanModerate from 'store/selectors/getCanModerate'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const members = group ? group.members.toModelArray().slice(0, 8) : []
  const leaders = group ? group.moderators.toModelArray() : []
  // console.log("leaders membershipcommonroles = ", leaders ? leaders[0]?.membershipCommonRoles?.toModelArray() : null)
  const canModerate = getCanModerate(state, { group }) // TODO
  const currentUser = getMe(state)

  return {
    group: group ? group.ref : null,
    members,
    leaders,
    slug: getRouteParam('groupSlug', state, props),
    canModerate,
    currentUser
  }
}

export default connect(mapStateToProps)
