import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import blockUser from 'store/actions/blockUser'
import getParam from 'store/selectors/getParam'
import getPreviousLocation from 'store/selectors/getPreviousLocation'

export function mapStateToProps (state, props) {
  return {
    memberId: getParam('id', state, props),
    previousLocation: getPreviousLocation(state)
  }
}

const mapDispatchToProps = {
  blockUser,
  push
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToPreviousLocation = () =>
    dispatchProps.push(stateProps.previousLocation)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPreviousLocation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
