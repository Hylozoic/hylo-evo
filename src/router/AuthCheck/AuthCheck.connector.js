import { isNull } from 'lodash'
import { connect } from 'react-redux'
import { checkLogin } from 'routes/NonAuthLayout/Login/Login.store'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import getMe from 'store/selectors/getMe'
import {
  fetchForCurrentUser,
  fetchForCommunity
} from './AuthCheck.store'

export function mapStateToProps (state, props) {
  return {
    hasCheckedLogin: !isNull(getIsLoggedIn(state)),
    isLoggedIn: getIsLoggedIn(state),
    currentUser: getMe(state)
  }
}

function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)
  return {
    checkLogin: () => dispatch(checkLogin()),
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics)),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
