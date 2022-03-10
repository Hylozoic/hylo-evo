import { connect } from 'react-redux'
import { mobileRedirect } from 'util/mobile'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import {
  setReturnToURL,
  getReturnToURL
} from './AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    isMobile: mobileRedirect(),
    isLoggedIn: getIsLoggedIn(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  setReturnToURL
}

export default connect(mapStateToProps, mapDispatchToProps)
