import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import { addCommunityName, addCommunityDomain, fetchCommunityExists } from '../CreateCommunity.store'
import { createCommunity, getNetwork } from './Review.store'

export function mapStateToProps (state, props) {
  const communityNetworkId = get('networkId', state.CreateCommunity)
  const network = getNetwork(state, {networkId: communityNetworkId})

  return {
    currentUser: getMe(state),
    communityDomain: get('domain', state.CreateCommunity),
    communityName: get('name', state.CreateCommunity),
    communityPrivacy: get('privacy', state.CreateCommunity),
    communityNetworkId,
    communityDomainExists: get('domainExists', state.CreateCommunity),
    networkName: get('name', network)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToCommunity: (communityDomain) => dispatch(push(`/c/${communityDomain}`)),
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    clearNameFromCreateCommunity: () => dispatch(addCommunityName(null)),
    clearDomainFromCreateCommunity: () => dispatch(addCommunityDomain(null)),
    createCommunity: (name, slug, networkId) => dispatch(createCommunity(name, slug, networkId)),
    goToPrivacyStep: () => dispatch(push('/create-community/privacy')),
    goHome: () => dispatch(push('/')),
    fetchCommunityExists: (slug) => dispatch(fetchCommunityExists(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
