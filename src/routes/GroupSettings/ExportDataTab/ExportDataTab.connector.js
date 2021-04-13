import { connect } from 'react-redux'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { requestMemberCSV } from './ExportData.store'

export function mapStateToProps (state, props) {
  const group = getGroupForCurrentRoute(state, props)

  return {
    group: group ? presentGroup(group) : null
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    memberExportMaker: id => () => dispatch(requestMemberCSV(id))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const group = stateProps.group || ownProps.group
  const {
    memberExportMaker
  } = dispatchProps

  let requestMemberCSV

  if (group && group.id) {
    requestMemberCSV = memberExportMaker(group.id)
  } else {
    requestMemberCSV = () => {}
  }

  return {
    ...stateProps,
    ...ownProps,
    requestMemberCSV
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
