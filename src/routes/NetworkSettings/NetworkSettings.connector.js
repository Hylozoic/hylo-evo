import { connect } from 'react-redux'
import { get, some } from 'lodash/fp'
import { bindActionCreators } from 'redux'

import {
  fetchModerators,
  getNetwork,
  getModerators,
  fetchNetworkSettings,
  updateNetworkSettings,
  getModeratorsPage
} from './NetworkSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import getMe from 'store/selectors/getMe'
import getRouteParam from 'store/selectors/getRouteParam'
import { FETCH_NETWORK_SETTINGS } from 'routes/NetworkSettings/NetworkSettings.store'

export function mapStateToProps (state, props) {
  const slug = getRouteParam('networkSlug', state, props)
  const network = getNetwork(state, {slug})

  const moderatorsPage = getModeratorsPage(state, props)
  const moderatorResultProps = {slug, page: moderatorsPage}
  const moderators = getModerators(state, moderatorResultProps)

  const confirm = state.FullPageModal.confirm
  const loading = !!state.pending[FETCH_NETWORK_SETTINGS]
  const me = getMe(state)

  return {
    isAdmin: me ? me.isAdmin : false,
    isModerator: me && moderators ? some(['id', me.id], moderators) : false,
    slug,
    network,
    moderators,
    loading,
    confirm,
    moderatorsPage
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes)),
    fetchModeratorsMaker: (slug, page) => () => dispatch(fetchModerators(slug, page)),
    ...bindActionCreators({
      setConfirmBeforeClose
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { network, slug, confirm, moderatorsPage } = stateProps
  const {
    fetchNetworkSettingsMaker,
    updateNetworkSettingsMaker,
    setConfirmBeforeClose,
    fetchModeratorsMaker
   } = dispatchProps
  let fetchModerators,
    fetchNetworkSettings,
    updateNetworkSettings

  if (slug) {
    fetchNetworkSettings = fetchNetworkSettingsMaker(slug)
    fetchModerators = fetchModeratorsMaker(slug, moderatorsPage)
  } else {
    fetchNetworkSettings = () => {}
  }

  const networkId = get('id', network)
  if (networkId) {
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
    setConfirm,
    fetchModerators
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
