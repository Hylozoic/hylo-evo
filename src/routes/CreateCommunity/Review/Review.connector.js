import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { updateUserSettings } from 'store/actions/updateUserSettings'
import { addCommunityName, addCommunityDomain, fetchCommunityExists } from '../CreateCommunity.store'
import { createCommunity } from './Review.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    communityDomain: get('domain', state.CreateCommunity),
    communityName: get('name', state.CreateCommunity),
    communityPrivacy: get('privacy', state.CreateCommunity),
    communityDomainExists: get('domainExists', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToCommunity: (communityDomain) => dispatch(push(`/c/${communityDomain}`)),
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    clearNameFromCreateCommunity: () => dispatch(addCommunityName(null)),
    clearDomainFromCreateCommunity: () => dispatch(addCommunityDomain(null)),
    createCommunity: (name, slug) => dispatch(createCommunity(name, slug)),
    goToPrivacyStep: () => dispatch(push('/create-community/privacy')),
    goHome: () => dispatch(push('/')),
    fetchCommunityExists: (slug) => dispatch(fetchCommunityExists(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
