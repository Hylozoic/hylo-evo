import { connect } from 'react-redux'
import { toggleCommunitiesDrawer } from './PrimaryLayout.store'
import fetchCurrentUser from 'store/actions/fetchCurrentUser'

import { getMe } from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

function mapStateToProps (state, props) {
  return {
    community: getCommunityForCurrentRoute(state, props),
    currentUser: getMe(state),
    communitiesDrawerOpen: state.communitiesDrawerOpen
  }
}

export const mapDispatchToProps = {
  fetchCurrentUser,
  toggleCommunitiesDrawer
}

export default connect(mapStateToProps, mapDispatchToProps)
