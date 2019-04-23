import { connect } from 'react-redux'
import { get, some } from 'lodash/fp'
import { bindActionCreators } from 'redux'

import {
  addNetworkModeratorRole,
  fetchModeratorAutocomplete,
  fetchModerators,
  setModeratorsPage,
  getModeratorAutocomplete,
  getModerators,
  getModeratorsPage,
  getModeratorsTotal,
  removeNetworkModeratorRole,
  PAGE_SIZE,
  FETCH_MODERATORS
} from '../NetworkSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const slug = props.network.slug

  const moderatorsPage = getModeratorsPage(state, props)
  const moderatorResultProps = { slug, page: moderatorsPage }
  const moderators = getModerators(state, moderatorResultProps)
  const moderatorsTotal = getModeratorsTotal(state, moderatorResultProps)
  const moderatorsPageCount = Math.ceil(moderatorsTotal / PAGE_SIZE)
  const moderatorsPending = state.pending[FETCH_MODERATORS]

  const moderatorAutocompleteCandidates = getModeratorAutocomplete(state) || []

  const me = getMe(state)

  return {
    isAdmin: me ? me.isAdmin : false,
    isModerator: me && moderators ? some(['id', me.id], moderators) : false,
    slug,
    moderators,
    moderatorAutocompleteCandidates,
    moderatorsPageCount,
    moderatorsPage,
    moderatorsPending
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    addNetworkModeratorRole: networkId => personId => dispatch(addNetworkModeratorRole(personId, networkId)),
    fetchModeratorAutocomplete: (auto, first, offset) => dispatch(fetchModeratorAutocomplete(auto, first, offset)),
    fetchModeratorsMaker: (slug, page) => () => dispatch(fetchModerators(slug, page)),
    removeNetworkModeratorRole: networkId => personId => dispatch(removeNetworkModeratorRole(personId, networkId)),
    ...bindActionCreators({
      setModeratorsPage
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { slug, moderatorsPage } = stateProps
  const { network } = ownProps
  const {
    fetchModeratorsMaker
  } = dispatchProps
  let addNetworkModeratorRole, fetchModerators

  if (slug) {
    fetchModerators = fetchModeratorsMaker(slug, moderatorsPage)
  }

  const networkId = get('id', network)
  if (networkId) {
    addNetworkModeratorRole = dispatchProps.addNetworkModeratorRole(networkId)
  } else {
    addNetworkModeratorRole = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addNetworkModeratorRole,
    fetchModerators
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
