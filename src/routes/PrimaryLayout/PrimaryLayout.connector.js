import { connect } from 'react-redux'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'
import { fetchCurrentUser, toggleCommunitiesDrawer } from './actions'
import { getMe } from 'store/selectors/getMe'

function mapStateToProps (state) {
  return {
    community: SAMPLE_COMMUNITY,
    currentUser: getMe(state.orm),
    communitiesDrawerOpen: state.communitiesDrawerOpen
  }
}

export default connect(mapStateToProps, {fetchCurrentUser, toggleCommunitiesDrawer})
