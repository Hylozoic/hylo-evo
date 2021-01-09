import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get } from 'lodash/fp'
import { addGroupPrivacy } from '../CreateGroup.store'

export function mapStateToProps (state, props) {
  return {
    groupPrivacy: get('privacy', state.CreateGroup)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-group/review')),
    goToPreviousStep: () => dispatch(push('/create-group/domain')),
    addGroupPrivacy: (privacy) => dispatch(addGroupPrivacy(privacy)),
    goHome: () => dispatch(push('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
