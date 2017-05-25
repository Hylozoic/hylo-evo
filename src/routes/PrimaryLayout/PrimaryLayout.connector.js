import { connect } from 'react-redux'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'
import { toggleDrawer } from './PrimaryLayout.store'
import { getMe } from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import isCommunityRoute from 'store/selectors/isCommunityRoute'

function mapStateToProps (state, props) {
  return {
    isCommunityRoute: isCommunityRoute(state, props),
    community: getCommunityForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.communitiesDrawerOpen
  }
}

export default connect(mapStateToProps, {fetchCurrentUser, toggleDrawer})
