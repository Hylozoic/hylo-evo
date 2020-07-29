import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { addCommunityName, addCommunityDomain, fetchCommunityExists } from '../CreateCommunity.store'
import { createCommunity, getNetwork } from './Review.store'

export function mapStateToProps (state, props) {
  const networkId = get('networkId', state.CreateCommunity)
  const network = getNetwork(state, { networkId })
  const templateId = get('templateId', state.CreateCommunity)
  const template = get('communityTemplates', state.CreateCommunity).find(ct => ct.id === templateId)

  return {
    defaultTopics: get('defaultTopics', state.CreateCommunity),
    domain: get('domain', state.CreateCommunity),
    domainExists: get('domainExists', state.CreateCommunity),
    name: get('name', state.CreateCommunity),
    networkId,
    networkName: get('name', network),
    privacy: get('privacy', state.CreateCommunity),
    template
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToCommunity: (communityDomain) => dispatch(push(`/c/${communityDomain}`)),
    clearNameFromCreateCommunity: () => dispatch(addCommunityName(null)),
    clearDomainFromCreateCommunity: () => dispatch(addCommunityDomain(null)),
    createCommunity: (name, slug, defaultTopics, networkId) => dispatch(createCommunity(name, slug, defaultTopics, networkId)),
    goToStep: (step) => dispatch(push('/create-community/' + step)),
    goHome: () => dispatch(push('/')),
    fetchCommunityExists: (slug) => dispatch(fetchCommunityExists(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
