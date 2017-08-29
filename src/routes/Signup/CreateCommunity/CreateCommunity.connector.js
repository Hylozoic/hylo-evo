import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { createCommunity } from './CreateCommunity.store'

export function mapDispatchToProps (dispatch, props) {
  return {
    createCommunity: () => dispatch(createCommunity()),
    goToNextStep: () => dispatch(push('/upload-photo'))
  }
}
export default connect(null, mapDispatchToProps)
