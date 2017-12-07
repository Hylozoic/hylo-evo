import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { bindActionCreators } from 'redux'

import {
  addCommunityToNetwork,
  addNetworkModeratorRole,
  fetchNetworkSettings,
  fetchModeratorAutocomplete,
  fetchModerators,
  fetchCommunities,
  fetchCommunityAutocomplete,
  updateNetworkSettings,
  getCommunityAutocomplete,
  getNetwork,
  setModeratorsPage,
  getModeratorAutocomplete,
  getModerators,
  getModeratorsPage,
  getModeratorsTotal,
  setCommunitiesPage,
  getCommunities,
  getCommunitiesPage,
  getCommunitiesTotal,
  removeCommunityFromNetwork,
  removeNetworkModeratorRole,
  PAGE_SIZE,
  FETCH_COMMUNITIES,
  FETCH_MODERATORS
} from './NetworkSettings.store'
import { setConfirmBeforeClose } from '../FullPageModal/FullPageModal.store'
import getMe from 'store/selectors/getMe'
import getParam from 'store/selectors/getParam'

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
  const communityAutocompleteCandidates = getCommunityAutocomplete(state) || []
  const moderatorAutocompleteCandidates = getModeratorAutocomplete(state) || []

  const confirm = state.FullPageModal.confirm

  const me = getMe(state)

  return {
    isAdmin: me ? me.isAdmin : false,
    slug,
    network,
    moderators,
    communities,
    confirm,
    moderatorAutocompleteCandidates,
    moderatorsPageCount,
    moderatorsPage,
    moderatorsPending,
    communityAutocompleteCandidates,
    communitiesPageCount,
    communitiesPage,
    communitiesPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addCommunityToNetwork: networkId => communityId => dispatch(addCommunityToNetwork(communityId, networkId)),
    addNetworkModeratorRole: networkId => personId => dispatch(addNetworkModeratorRole(personId, networkId)),
    fetchCommunityAutocomplete: (auto, first, offset) => dispatch(fetchCommunityAutocomplete(auto, first, offset)),
    fetchModeratorAutocomplete: (auto, first, offset) => dispatch(fetchModeratorAutocomplete(auto, first, offset)),
    fetchNetworkSettingsMaker: slug => () => dispatch(fetchNetworkSettings(slug)),
    updateNetworkSettingsMaker: id => changes => dispatch(updateNetworkSettings(id, changes)),
    fetchModeratorsMaker: (slug, page) => () => dispatch(fetchModerators(slug, page)),
    fetchCommunitiesMaker: (slug, page) => () => dispatch(fetchCommunities({slug, page})),
    removeCommunityFromNetwork: networkId => communityId => dispatch(removeCommunityFromNetwork(communityId, networkId)),
    removeNetworkModeratorRole: networkId => personId => dispatch(removeNetworkModeratorRole(personId, networkId)),
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
  let addCommunityToNetwork,
    addNetworkModeratorRole,
    fetchCommunities,
    fetchModerators,
    fetchNetworkSettings,
    updateNetworkSettings

  if (slug) {
    fetchNetworkSettings = fetchNetworkSettingsMaker(slug)
    fetchModerators = fetchModeratorsMaker(slug, moderatorsPage)
    fetchCommunities = fetchCommunitiesMaker(slug, communitiesPage)
  } else {
    fetchNetworkSettings = () => {}
  }

  const networkId = get('id', network)
  if (networkId) {
    addCommunityToNetwork = dispatchProps.addCommunityToNetwork(networkId)
    addNetworkModeratorRole = dispatchProps.addNetworkModeratorRole(networkId)
    updateNetworkSettings = updateNetworkSettingsMaker(network.id)
  } else {
    addCommunityToNetwork = () => {}
    addNetworkModeratorRole = () => {}
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
    addCommunityToNetwork,
    addNetworkModeratorRole,
    fetchNetworkSettings,
    updateNetworkSettings,
    setConfirm,
    fetchModerators,
    fetchCommunities
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
