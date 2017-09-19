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
    returnToURL: getReturnToURL(state),
    currentUser: getMe(state)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    setReturnToURL: path => dispatch(setReturnToURL(path)),
    resetReturnToURL: () => dispatch(resetReturnToURL())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
