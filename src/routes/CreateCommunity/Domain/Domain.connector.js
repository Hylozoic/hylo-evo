import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { fetchCommunityExists } from './Domain.store'
import { addCommunityDomain } from '../CreateCommunity.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    communityDomain: get('domain', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/review')),
    goToPreviousStep: () => dispatch(push('/create-community/name')),
    addCommunityDomain: (domain) => dispatch(addCommunityDomain(domain)),
    fetchCommunityExists: (slug) => dispatch(fetchCommunityExists(slug)),
    goHome: (slug) => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
