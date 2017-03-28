import { connect } from 'react-redux'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'
import { fetchCurrentUser } from './actions'

function mapStateToProps ({currentUser}) {
  return {
    community: SAMPLE_COMMUNITY,
    currentUser
  }
}

export default connect(mapStateToProps, {fetchCurrentUser})
