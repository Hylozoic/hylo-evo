import { connect } from 'react-redux'
import mobileRedirect from 'util/mobileRedirect'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import {
  setReturnToURL,
  getReturnToURL
} from './AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    // NOTE: Must not assign to isMobile as that is a global used (and then reassigned by
    // ismobilejs npm module.
    isMobileBrowser: mobileRedirect(),
    isLoggedIn: getIsLoggedIn(state),
    currentUser: getMe(state),
    returnToURL: getReturnToURL(state)
  }
}

export const mapDispatchToProps = {
  setReturnToURL
}

export default connect(mapStateToProps, mapDispatchToProps)
