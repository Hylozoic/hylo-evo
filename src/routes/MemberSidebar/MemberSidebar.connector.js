import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'

export function mapStateToProps (state, props) {
  return {
    memberId: getParam('id', state, props)
  }
}

export default connect(mapStateToProps)
