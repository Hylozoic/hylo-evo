import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/domain'))
  }
}

export default connect(null, mapDispatchToProps)
