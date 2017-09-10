import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import getMe from 'store/selectors/getMe'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    communityDomain: get('domain', state.CreateCommunity),
    communityName: get('name', state.CreateCommunity),
    communityPrivacy: get('privacy', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
