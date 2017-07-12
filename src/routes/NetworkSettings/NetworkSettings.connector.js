import { connect } from 'react-redux'
import {
  fetchNetworkSettings,
  fetchModerators,
  updateNetworkSettings,
  setModeratorsPage,
  getNetwork,
  getModerators,
  getModeratorsPage,
  getModeratorsTotal,
  PAGE_SIZE
} from './NetworkSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const slug = getParam('slug', state, props)
  const network = getNetwork(state, {slug})

  const moderatorsPage = getModeratorsPage(state, props)
  const moderatorResultProps = {slug, offset: PAGE_SIZE * moderatorsPage}
  const moderators = getModerators(state, moderatorResultProps)
  const moderatorsTotal = getModeratorsTotal(state, moderatorResultProps)
  const moderatorsPageCount = Math.ceil(moderatorsTotal / PAGE_SIZE)

  const communities = network && network.communities.toModelArray()
  const confirm = state.FullPageModal.confirm

  return {
    slug,
    network,
    moderators,
    communities,
    confirm,
    moderatorsPageCount,
    moderatorsPage
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes)),
    fetchModeratorsMaker: (slug, offset) => () => dispatch(fetchModerators(slug, offset)),
    setConfirmBeforeClose: confirm => dispatch(setConfirmBeforeClose(confirm)),
    setModeratorsPage: page => dispatch(setModeratorsPage(page))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { network, slug, confirm, moderatorsPage } = stateProps
  const {
    fetchNetworkSettingsMaker, updateNetworkSettingsMaker, setConfirmBeforeClose, fetchModeratorsMaker
   } = dispatchProps
  var fetchNetworkSettings, updateNetworkSettings, fetchModerators

  if (slug) {
    fetchNetworkSettings = fetchNetworkSettingsMaker(slug)
    fetchModerators = fetchModeratorsMaker(slug, moderatorsPage * PAGE_SIZE)
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
    setConfirm,
    fetchModerators
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
