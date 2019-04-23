import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { addCommunityName, addNetworkId } from '../CreateCommunity.store'
import getRouteParam from 'store/selectors/getRouteParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const networkId = getRouteParam('networkId', state, props)
  return {
    networkId,
    communityName: get('name', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/domain')),
    goHome: () => dispatch(push('/')),
    addCommunityName: name => dispatch(addCommunityName(name)),
    addNetworkId: networkId => dispatch(addNetworkId(networkId))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { networkId } = stateProps
  const addNetworkId = networkId
    ? () => dispatchProps.addNetworkId(networkId)
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addNetworkId
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
