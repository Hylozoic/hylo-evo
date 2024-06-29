import { connect } from 'react-redux'
import getRouteParam from 'store/selectors/getRouteParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getCanModerate from 'store/selectors/getCanModerate'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const members = group ? group.members.toModelArray().slice(0, 8) : []
  const leaders = group ? group.moderators.toModelArray() : []
  const canModerate = getCanModerate(state, { group })

  return {
    group: group ? group.ref : null,
    members,
    leaders,
    slug: getRouteParam('groupSlug', props),
    canModerate
  }
}

export default connect(mapStateToProps)
