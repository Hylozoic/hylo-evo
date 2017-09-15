import { connect } from 'react-redux'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import {
  setReturnToURL,
  resetReturnToURL,
  getReturnToURL
} from './AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    isLoggedIn: getIsLoggedIn(state),
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  setReturnToURL,
  resetReturnToURL
}

export default connect(mapStateToProps, mapDispatchToProps)
