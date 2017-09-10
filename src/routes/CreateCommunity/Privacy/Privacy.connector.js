import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  return {
    communityPrivacy: get('privacy', state.CreateCommunity)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/review')),
    goToPreviousStep: () => dispatch(push('/create-community/domain'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
