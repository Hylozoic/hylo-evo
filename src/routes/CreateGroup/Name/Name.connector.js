import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { addGroupName, addParentIds } from '../CreateGroup.store'
import getRouteParam from 'store/selectors/getRouteParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const parentId = getRouteParam('groupId', state, props)
  return {
    parentIds: [parentId],
    groupName: get('name', state.CreateGroup)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-group/domain')),
    goHome: () => dispatch(push('/')),
    addGroupName: name => dispatch(addGroupName(name)),
    addParentIds: parentIds => dispatch(addParentIds(parentIds))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { parentId } = stateProps
  const addParentIds = parentId
    ? () => dispatchProps.addParentIds([parentId])
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addParentIds
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
