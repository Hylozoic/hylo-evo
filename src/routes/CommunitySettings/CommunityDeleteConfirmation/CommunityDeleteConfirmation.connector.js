import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { allCommunitiesUrl } from 'util/navigation'

export function mapDispatchToProps (dispatch) {
  return {
    goToAllCommunities: () => dispatch(push(allCommunitiesUrl()))
  }
}

export default connect(null, mapDispatchToProps)
