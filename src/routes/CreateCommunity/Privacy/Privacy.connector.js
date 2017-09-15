import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash/fp'
import { addCommunityPrivacy } from '../CreateCommunity.store'

export function mapStateToProps (state, props) {
  return {
    communityPrivacy: get('privacy', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/review')),
    goToPreviousStep: () => dispatch(push('/create-community/domain')),
    addCommunityPrivacy: (privacy) => dispatch(addCommunityPrivacy(privacy)),
    goHome: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
