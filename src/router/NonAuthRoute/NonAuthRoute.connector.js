import { connect } from 'react-redux'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state)
  }
}

export default connect(mapStateToProps)
