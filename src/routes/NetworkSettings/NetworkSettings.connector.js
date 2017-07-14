import { connect } from 'react-redux'
import {
  fetchNetworkSettings,
  fetchModerators,
  fetchCommunities,
  updateNetworkSettings,
  getNetwork,
  setModeratorsPage,
  getModerators,
  getModeratorsPage,
  getModeratorsTotal,
  setCommunitiesPage,
  getCommunities,
  getCommunitiesPage,
  getCommunitiesTotal,
  PAGE_SIZE,
  FETCH_COMMUNITIES,
  FETCH_MODERATORS
} from './NetworkSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import getParam from 'store/selectors/getParam'
import { get } from 'lodash/fp'
import { bindActionCreators } from 'redux'

export function mapStateToProps (state, props) {
  const slug = getParam('networkSlug', state, props)
  const network = getNetwork(state, {slug})

  const moderatorsPage = getModeratorsPage(state, props)
  const moderatorResultProps = {slug, page: moderatorsPage}
  const moderators = getModerators(state, moderatorResultProps)
  const moderatorsTotal = getModeratorsTotal(state, moderatorResultProps)
  const moderatorsPageCount = Math.ceil(moderatorsTotal / PAGE_SIZE)
  const moderatorsPending = state.pending[FETCH_MODERATORS]

  const communitiesPage = getCommunitiesPage(state, props)
  const communitiesResultProps = {slug, page: communitiesPage}
  const communities = getCommunities(state, communitiesResultProps)
  const communitiesTotal = getCommunitiesTotal(state, communitiesResultProps)
  const communitiesPageCount = Math.ceil(communitiesTotal / PAGE_SIZE)
  const communitiesPending = state.pending[FETCH_COMMUNITIES]

  const confirm = state.FullPageModal.confirm

  return {
    slug,
    network,
    moderators,
    communities,
    confirm,
    moderatorsPageCount,
    moderatorsPage,
    moderatorsPending,
    communitiesPageCount,
    communitiesPage,
    communitiesPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes)),
    fetchModeratorsMaker: (slug, page) => () => dispatch(fetchModerators(slug, page)),
    fetchCommunitiesMaker: (slug, page) => () => dispatch(fetchCommunities(slug, page)),
    ...bindActionCreators({
      setConfirmBeforeClose, setModeratorsPage, setCommunitiesPage
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { network, slug, confirm, moderatorsPage, communitiesPage } = stateProps
  const {
    fetchNetworkSettingsMaker,
    updateNetworkSettingsMaker,
    setConfirmBeforeClose,
    fetchModeratorsMaker,
    fetchCommunitiesMaker
   } = dispatchProps
  var fetchNetworkSettings, updateNetworkSettings, fetchModerators, fetchCommunities

  if (slug) {
    fetchNetworkSettings = fetchNetworkSettingsMaker(slug)
    fetchModerators = fetchModeratorsMaker(slug, moderatorsPage)
    fetchCommunities = fetchCommunitiesMaker(slug, communitiesPage)
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
    fetchModerators,
    fetchCommunities
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
