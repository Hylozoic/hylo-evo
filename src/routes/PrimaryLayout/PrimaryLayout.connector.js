import { connect } from 'react-redux'
import {
  fetchForCurrentUser, fetchForCommunity, toggleDrawer
} from './PrimaryLayout.store'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'

function mapStateToProps (state, props) {
  return {
    isCommunityRoute: isCommunityRoute(state, props),
    community: getCommunityForCurrentRoute(state, props),
    currentUser: getMe(state),
    isDrawerOpen: state.PrimaryLayout.isDrawerOpen,
    showTitleBadge: true
  }
}

function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    fetchForCurrentUser: skipTopics => dispatch(fetchForCurrentUser(slug, skipTopics)),
    fetchForCommunity: () => dispatch(fetchForCommunity(slug)),
    toggleDrawer: () => dispatch(toggleDrawer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
