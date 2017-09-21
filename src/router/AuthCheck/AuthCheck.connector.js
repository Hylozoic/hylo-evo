import { isNull } from 'lodash'
import { connect } from 'react-redux'
import { checkLogin } from 'routes/NonAuthLayout/Login/Login.store'
import fetchForCurrentUser from 'store/actions/fetchForCurrentUser'
import getIsLoggedIn from 'store/selectors/getIsLoggedIn'
import getMe from 'store/selectors/getMe'
import { getSlugFromLocation } from 'store/selectors/isCommunityRoute'

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
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
