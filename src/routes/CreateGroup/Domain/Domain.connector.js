import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { addGroupDomain, fetchGroupExists } from '../CreateGroup.store'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    groupDomain: get('domain', state.CreateGroup),
    groupDomainExists: get('domainExists', state.CreateGroup)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-group/review')),
    goToPreviousStep: () => dispatch(push('/create-group/name')),
    addGroupDomain: (domain) => dispatch(addGroupDomain(domain)),
    fetchGroupExists: (slug) => dispatch(fetchGroupExists(slug)),
    goHome: (slug) => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
