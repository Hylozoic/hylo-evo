import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { addCommunityName } from './Name.store'

export function mapStateToProps (state, props) {
  return {
    communityName: state.CreateCommunity.name,
    domainName: state.CreateCommunity.domain
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/domain')),
    addCommunityName: (name) => dispatch(addCommunityName(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
