import { connect } from 'react-redux'
import { fetchCurrentUser, toggleDrawer } from './PrimaryLayout.store'
import { getMe } from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.communitiesDrawerOpen
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser,
  toggleDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
