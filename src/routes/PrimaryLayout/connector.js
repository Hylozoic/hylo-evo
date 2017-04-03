import { connect } from 'react-redux'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'
import { fetchCurrentUser, toggleCommunitiesDrawer } from './actions'

function mapStateToProps ({currentUser, communitiesDrawerOpen}) {
  return {
    community: SAMPLE_COMMUNITY,
    currentUser,
    communitiesDrawerOpen
  }
}

export default connect(mapStateToProps, {fetchCurrentUser, toggleCommunitiesDrawer})
