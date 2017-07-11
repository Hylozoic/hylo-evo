import { connect } from 'react-redux'
import {
  fetchNetworkSettings,
  updateNetworkSettings,
  getNetwork
} from './NetworkSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  const network = getNetwork(state, {slug})
  const moderators = network && network.moderators.toModelArray()
  const communities = network && network.communities.toModelArray()
  const confirm = state.FullPageModal.confirm

  return {
    slug,
    network,
    moderators,
    communities,
    confirm
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes)),
    setConfirmBeforeClose: confirm => dispatch(setConfirmBeforeClose(confirm))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { network, slug, confirm } = stateProps
  const {
    fetchNetworkSettingsMaker, updateNetworkSettingsMaker, setConfirmBeforeClose
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

  const setConfirm = newState => {
    if (newState === confirm) return
    return setConfirmBeforeClose(newState)
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchNetworkSettings,
    updateNetworkSettings,
    setConfirm
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
