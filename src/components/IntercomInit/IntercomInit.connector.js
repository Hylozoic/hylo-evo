import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state)
  }
}

export default connect(mapStateToProps)
