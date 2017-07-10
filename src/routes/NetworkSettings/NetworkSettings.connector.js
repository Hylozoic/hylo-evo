import { connect } from 'react-redux'
import {
  fetchNetworkSettings,
  updateNetworkSettings,
  getNetwork
} from './NetworkSettings.store'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  const network = getNetwork(state, {slug})
  const moderators = network && network.moderators.toModelArray()
  const communities = network && network.communities.toModelArray()
  return {
    slug,
    network,
    moderators,
    communities
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { network, slug } = stateProps
  const {
    fetchNetworkSettingsMaker, updateNetworkSettingsMaker
   } = dispatchProps
  var fetchNetworkSettings, updateNetworkSettings

  if (slug) {
    fetchNetworkSettings = fetchNetworkSettingsMaker(slug)
  } else {
    fetchNetworkSettings = () => {}
  }

  if (get('id', network)) {
    updateNetworkSettings = updateNetworkSettingsMaker(network.id)
  } else {
    updateNetworkSettings = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchNetworkSettings,
    updateNetworkSettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
