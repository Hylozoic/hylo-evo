import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    communityName: state.CreateCommunity.name,
    domainName: state.CreateCommunity.domain
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
