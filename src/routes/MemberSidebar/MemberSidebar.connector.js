import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import blockUser from 'store/actions/blockUser'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPreviousLocation from 'store/selectors/getPreviousLocation'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    memberId: getParam('id', state, props),
    previousLocation: getPreviousLocation(state) || '/'
  }
}

const mapDispatchToProps = {
  blockUser,
  push
}

export function mergeProps(stateProps, dispatchProps, ownProps) {
  const blockUser = () => dispatchProps
    .blockUser(stateProps.memberId)
    .then(() => dispatchProps.push(stateProps.previousLocation))

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    blockUser
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
