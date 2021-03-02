import { connect } from 'react-redux'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)
  const queryProps = { groupSlug: group.slug }
  const childGroups = getChildGroups(state, queryProps)
  const parentGroups = getParentGroups(state, queryProps)

  return {
    childGroups,
    group,
    parentGroups
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
