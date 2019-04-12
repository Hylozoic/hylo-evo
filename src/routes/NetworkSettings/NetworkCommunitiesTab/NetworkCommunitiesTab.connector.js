import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { bindActionCreators } from 'redux'
import { push } from 'connected-react-router'

import {
  addCommunityToNetwork,
  fetchCommunities,
  fetchCommunityAutocomplete,
  getCommunityAutocomplete,
  setCommunitiesPage,
  getCommunities,
  getCommunitiesPage,
  getCommunitiesTotal,
  removeCommunityFromNetwork,
  PAGE_SIZE,
  FETCH_COMMUNITIES
} from '../NetworkSettings.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const slug = props.network.slug

  const communitiesPage = getCommunitiesPage(state, props)
  const communitiesResultProps = {slug, page: communitiesPage}
  const communities = getCommunities(state, communitiesResultProps)
  const communitiesTotal = getCommunitiesTotal(state, communitiesResultProps)
  const communitiesPageCount = Math.ceil(communitiesTotal / PAGE_SIZE)
  const communitiesPending = state.pending[FETCH_COMMUNITIES]
  const communityAutocompleteCandidates = getCommunityAutocomplete(state) || []

  const me = getMe(state)

  return {
    isAdmin: me ? me.isAdmin : false,
    slug,
    communities,
    communityAutocompleteCandidates,
    communitiesPageCount,
    communitiesPage,
    communitiesPending
  }
}

export function mapDispatchToProps (dispatch, state) {
  return {
    addCommunityToNetwork: networkId => communityId => dispatch(addCommunityToNetwork(communityId, networkId)),
    fetchCommunityAutocomplete: (auto, first, offset) => dispatch(fetchCommunityAutocomplete(auto, first, offset)),
    fetchCommunitiesMaker: (slug, page) => () => dispatch(fetchCommunities({slug, page})),
    removeCommunityFromNetwork: networkId => communityId => dispatch(removeCommunityFromNetwork(communityId, networkId)),
    createCommunity: networkId => () => dispatch(push(`/create-community/name/${networkId}`)),
    ...bindActionCreators({
      setCommunitiesPage
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { slug, communitiesPage } = stateProps
  const { network } = ownProps
  const {
    fetchCommunitiesMaker
  } = dispatchProps
  let addCommunityToNetwork, fetchCommunities, createCommunity

  if (slug) {
    fetchCommunities = fetchCommunitiesMaker(slug, communitiesPage)
  }

  const networkId = get('id', network)
  if (networkId) {
    addCommunityToNetwork = dispatchProps.addCommunityToNetwork(networkId)
    createCommunity = dispatchProps.createCommunity(networkId)
  } else {
    addCommunityToNetwork = () => {}
    createCommunity = () => {}
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addCommunityToNetwork,
    fetchCommunities,
    createCommunity
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
