import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/'))
  }
}

export default connect(null, mapDispatchToProps)
